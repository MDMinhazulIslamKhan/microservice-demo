import { logger } from '../utils/logger';
import { kafka } from './kafka';
import { Partitioners, Producer } from 'kafkajs';
import { EventEnvelope } from './types';

export const producer: Producer = kafka.producer({
  idempotent: true,
  allowAutoTopicCreation: false,
  maxInFlightRequests: 5,
  createPartitioner: Partitioners.LegacyPartitioner,
});

export const connectProducers = async (): Promise<void> => {
  await Promise.all([producer.connect()]);
  logger.info('Kafka producers connected', {
    label: 'Kafka',
  });
};

export const disconnectProducers = async (): Promise<void> => {
  await Promise.all([producer.disconnect()]);
  logger.info('Kafka producers disconnected', {
    label: 'Kafka',
  });
};

export const sendMessage = async <T>(
  topic: string,
  key: string,
  event: string,
  payload: T,
  serviceName = 'auth-service'
) => {
  const envelope: EventEnvelope<T> = {
    event,
    key,
    payload,
    metadata: {
      timestamp: new Date().toISOString(),
      version: 1,
      service: serviceName,
    },
  };

  await producer.send({
    topic,
    messages: [{ key, value: JSON.stringify(envelope) }],
    acks: -1,
  });
};
