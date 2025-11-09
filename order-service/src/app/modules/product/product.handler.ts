import { EventEnvelope } from '../../../kafka/types';
import prisma from '../../../shared/prisma';

type NewProductEventData = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
};

type UpdateProductEventData = {
  id: string;
  name?: string;
  price?: number;
  isActive?: boolean;
};

export const handleProductCreated = async (
  envelope: EventEnvelope<NewProductEventData>
): Promise<void> => {
  try {
    await prisma.product.create({
      data: {
        syncId: envelope.payload.id,
        name: envelope.payload.name,
        price: envelope.payload.price,
        isActive: envelope.payload.isActive,
      },
    });
  } catch {
    throw Error();
  }
};

export const handleProductUpdated = async (
  envelope: EventEnvelope<UpdateProductEventData>
): Promise<void> => {
  try {
    const { id, ...updatedProductDate } = envelope.payload;

    await prisma.product.update({
      where: { syncId: id },
      data: {
        ...updatedProductDate,
      },
    });
  } catch {
    throw Error();
  }
};
