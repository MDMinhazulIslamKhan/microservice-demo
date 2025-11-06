import { Kafka } from 'kafkajs';
import kafkaConfig from '../config/kafkaConfig';
import { kafkaLogger } from '../utils/logger';

export const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
  retry: {
    maxRetryTime: 30000,
    initialRetryTime: 1000,
    factor: 0.2,
  },
  requestTimeout: 30000,
  connectionTimeout: 10000,
  authenticationTimeout: 3000,
  logCreator: () => kafkaLogger,
});
