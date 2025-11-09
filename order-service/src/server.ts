import { Server } from 'http';
import app from './app';
import config from './config/index';
import { errorLogger, logger } from './utils/logger';
import { Consumer } from 'kafkajs';
import { startAllConsumers } from './kafka/subscriptions';

let server: Server;
const consumers: Consumer[] = [];

process.on('uncaughtException', (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.stack ?? error.message : String(error);

  errorLogger.error(`Uncaught Exception: ${errorMessage}`, {
    label: 'Server',
  });
  process.exit(1);
});

async function main() {
  try {
    // kafka consumers
    const runningConsumers = await startAllConsumers();
    consumers.push(...runningConsumers);

    logger.info('All consumers started', {
      label: 'Kafka',
    });

    // server
    server = app.listen(config.port, () => {
      logger.info(
        `Microservice test order service listening on port ${config.port}`,
        {
          label: 'Server',
        }
      );
    });

    const shutdown = (signal: string) => {
      process.once(signal, () => {
        handleShutdown(`${signal} received. Shutting down gracefully.`);
      });
    };

    shutdown('SIGTERM');
    shutdown('SIGINT');

    process.on('unhandledRejection', (reason: unknown) => {
      errorLogger.error(`Unhandled Rejection: ${reason}`, { label: 'Server' });
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.stack ?? error.message : String(error);
    errorLogger.error(`Server startup error: ${errorMessage}`, {
      label: 'Server',
    });
    await handleShutdown(`Server startup error: ${errorMessage}`);
  }
}

const handleShutdown = async (message: string, code: 0 | 1 = 1) => {
  logger.info(message, { label: 'ServerShutdown' });

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.', { label: 'ServerShutdown' });
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
};

main();
