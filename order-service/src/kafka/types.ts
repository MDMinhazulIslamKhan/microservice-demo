export type EventEnvelope<T> = {
  event: string;
  key: string;
  payload: T;
  metadata: {
    timestamp: string;
    version: number;
    service: string;
  };
};
