import { UserRoles } from '@prisma/client';
import { sendMessage } from '../../../kafka/producer';
import { KAFKA_TOPICS } from '../../../kafka/topics';

import { AUTH_SERVICE_EVENTS } from '../../../kafka/events';

type PublishNewUser = {
  id: string;
  email: string;
  name: string;
  role?: UserRoles;
};

type PublishUpdateUser = {
  id: string;
  name?: string;
  role?: UserRoles;
};

const publishUserCreated = async (payload: PublishNewUser, key?: string) => {
  await sendMessage(
    KAFKA_TOPICS.AUTH_SERVICE,
    key ?? payload.id,
    AUTH_SERVICE_EVENTS.USER_CREATED,
    payload
  );
};

const publishUserUpdated = async (payload: PublishUpdateUser, key?: string) => {
  await sendMessage(
    KAFKA_TOPICS.AUTH_SERVICE,
    key ?? payload.id,
    AUTH_SERVICE_EVENTS.USER_UPDATED,
    payload
  );
};

export const UserEvents = { publishUserCreated, publishUserUpdated };
