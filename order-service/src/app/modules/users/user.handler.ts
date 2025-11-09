import { UserRoles } from '@prisma/client';
import { EventEnvelope } from '../../../kafka/types';
import prisma from '../../../shared/prisma';

export type NewUserEventData = {
  id: string;
  email: string;
  name: string;
  role?: UserRoles;
};

export type UpdateUserEventData = {
  id: string;
  name?: string;
  role?: UserRoles;
};

export const handleUserCreated = async (
  envelope: EventEnvelope<NewUserEventData>
): Promise<void> => {
  try {
    await prisma.user.create({
      data: {
        syncId: envelope.payload.id,
        name: envelope.payload.name,
        email: envelope.payload.email,
        role: envelope.payload.role,
      },
    });
  } catch {
    throw Error();
  }
};

export const handleUserUpdated = async (
  envelope: EventEnvelope<UpdateUserEventData>
): Promise<void> => {
  try {
    const { id, ...updatedUserDate } = envelope.payload;

    await prisma.user.update({
      where: { syncId: id },
      data: {
        ...updatedUserDate,
      },
    });
  } catch {
    throw Error();
  }
};
