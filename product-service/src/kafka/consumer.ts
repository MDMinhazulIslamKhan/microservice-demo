/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Consumer, EachMessagePayload } from 'kafkajs';
import { kafka } from './kafka';
import { errorLogger, logger } from '../utils/logger';
import { EventEnvelope } from './types';

export type EventHandler = (
  envelope: EventEnvelope<any>,
  raw: EachMessagePayload
) => Promise<void>;

export const startConsumer = async (
  topic: string,
  groupId: string,
  handlers: Record<string, EventHandler>
): Promise<Consumer> => {
  const consumer: Consumer = kafka.consumer({
    groupId,
    allowAutoTopicCreation: false,
    sessionTimeout: 30000,
  });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async payload => {
      const raw = payload.message.value?.toString();
      if (!raw) return;

      try {
        const envelope: EventEnvelope<unknown> = JSON.parse(raw);
        const handler = handlers[envelope.event];

        if (!handler) {
          logger.warn(`No handler for event ${envelope.event}`, {
            label: 'Kafka',
          });
          return;
        }

        await handler(envelope, payload);
      } catch (err) {
        errorLogger.error(
          `Consumer error: ${err instanceof Error ? err.message : err}`,
          {
            label: 'Kafka',
          }
        );
      }
    },
  });

  logger.info(`Consumer started for topic ${topic}, groupId ${groupId}`, {
    label: 'Kafka',
  });

  return consumer;
};
