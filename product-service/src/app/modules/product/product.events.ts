import { sendMessage } from '../../../kafka/producer';
import { KAFKA_TOPICS } from '../../../kafka/topics';
import { PRODUCT_SERVICE_EVENTS } from '../../../kafka/events';

type PublishNewProduct = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
};

type PublishUpdateProduct = {
  id: string;
  name?: string;
  price?: number;
  isActive?: boolean;
};

const publishProductCreated = async (
  payload: PublishNewProduct,
  key?: string
) => {
  await sendMessage(
    KAFKA_TOPICS.PRODUCT_SERVICE,
    key ?? payload.id,
    PRODUCT_SERVICE_EVENTS.PRODUCT_CREATED,
    payload
  );
};

const publishProductUpdated = async (
  payload: PublishUpdateProduct,
  key?: string
) => {
  await sendMessage(
    KAFKA_TOPICS.PRODUCT_SERVICE,
    key ?? payload.id,
    PRODUCT_SERVICE_EVENTS.PRODUCT_UPDATED,
    payload
  );
};

export const ProductEvents = { publishProductCreated, publishProductUpdated };
