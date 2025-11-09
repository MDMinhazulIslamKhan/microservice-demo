import config from '../config';
import { errorLogger, logger } from '../utils/logger';
import { kafka } from './kafka';
import kafkaConfig from '../config/kafkaConfig';

export const KAFKA_TOPICS = {
  AUTH_SERVICE: 'auth_events',
  PRODUCT_SERVICE: 'product_events',
};

export const ensureTopicExists = async (topic: string): Promise<void> => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const existingTopics = await admin.listTopics();

    if (existingTopics.includes(topic)) {
      logger.info(`Topic "${topic}" already exists.`, {
        label: 'Kafka',
      });
      return;
    }

    const created = await admin.createTopics({
      topics: [
        {
          topic: topic,
          numPartitions: kafkaConfig.numPartitions,
          replicationFactor: kafkaConfig.replicationFactor,
        },
      ],
    });

    if (created) {
      logger.info(`Topic "${topic}" created successfully.`, {
        label: 'Kafka',
      });
    } else {
      logger.info(`Topic "${topic}" creation not acknowledged.`, {
        label: 'Kafka',
      });
    }
  } catch (error) {
    errorLogger.error(`Error creating topic "${topic}": ${error}`, {
      label: 'Kafka',
    });
  } finally {
    await admin.disconnect();
  }
};

const createAllTopics = async () => {
  if (config.env !== 'production') return;

  for (const topic of Object.values(KAFKA_TOPICS)) {
    await ensureTopicExists(topic);
  }
};

createAllTopics().catch(error => {
  errorLogger.error(`Failed to ensure topics exist: ${error}`, {
    label: 'Kafka',
  });
});
