/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { errorLogger } from '../utils/logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('error', (err: any) => {
  const errorMessage =
    err instanceof Error ? err.stack ?? err.message : String(err);
  errorLogger.error(`prisma error ${errorMessage}`, { label: 'Prisma' });
});

// prisma.$on('query', (e: any) => {
//   logger.info(`Query: ${e.query}`, { label: 'Prisma' });
//   logger.info(`Params: ${e.params}`, { label: 'Prisma' });
//   logger.info(`Duration: ${e.duration} ms`, { label: 'Prisma' });
// });

export default prisma;
