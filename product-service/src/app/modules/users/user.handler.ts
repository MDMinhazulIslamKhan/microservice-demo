import { NewUserEventData, UpdateUserEventData } from './user.interface';
import { EventEnvelope } from '../../../kafka/types';
import { User } from './user.model';

export const handleUserCreated = async (
  envelope: EventEnvelope<NewUserEventData>
): Promise<void> => {
  try {
    await User.create({
      syncId: envelope.payload.id,
      name: envelope.payload.name,
      email: envelope.payload.email,
      role: envelope.payload.role || 'USER',
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

    await User.findOneAndUpdate(
      {
        syncId: id,
      },
      { $set: { ...updatedUserDate } }
    );
  } catch {
    throw Error();
  }
};
