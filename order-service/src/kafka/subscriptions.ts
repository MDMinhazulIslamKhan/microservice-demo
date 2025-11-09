import { Consumer } from 'kafkajs';
import { KAFKA_TOPICS } from './topics';
import { startConsumer, EventHandler } from './consumer';
import { logger } from '../utils/logger';
import { AUTH_SERVICE_EVENTS, PRODUCT_SERVICE_EVENTS } from './events';
import {
  handleUserCreated,
  handleUserUpdated,
} from '../app/modules/users/user.handler';
import {
  handleProductCreated,
  handleProductUpdated,
} from '../app/modules/product/product.handler';

const topicHandlers: Record<string, Record<string, EventHandler>> = {
  [KAFKA_TOPICS.AUTH_SERVICE]: {
    [AUTH_SERVICE_EVENTS.USER_CREATED]: handleUserCreated,
    [AUTH_SERVICE_EVENTS.USER_UPDATED]: handleUserUpdated,
  },
  [KAFKA_TOPICS.PRODUCT_SERVICE]: {
    [PRODUCT_SERVICE_EVENTS.PRODUCT_CREATED]: handleProductCreated,
    [PRODUCT_SERVICE_EVENTS.PRODUCT_UPDATED]: handleProductUpdated,
  },
};

export const startAllConsumers = async (): Promise<Consumer[]> => {
  const consumers: Consumer[] = [];

  for (const [topic, handlers] of Object.entries(topicHandlers)) {
    const consumerGroupId = `order-service-group-${topic}`;
    logger.info(`Starting consumer for group ${consumerGroupId}`, {
      label: 'Kafka',
    });

    const consumer = await startConsumer(topic, consumerGroupId, handlers);
    consumers.push(consumer);
  }

  return consumers;
};
