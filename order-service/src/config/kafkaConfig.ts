type Env = {
  KAFKA_BROKERS: string; // comma separated
  NUMBER_OF_PARTITION?: string;
  REPLICATION_FACTOR?: string;
};

const env = process.env as unknown as Env;

const brokers = env.KAFKA_BROKERS.split(',').map(b => b.trim());

const kafkaConfig = {
  clientId: 'order-service',
  brokers,
  numPartitions: Number(env.NUMBER_OF_PARTITION) || 12,
  replicationFactor: Number(env.REPLICATION_FACTOR) || 3,
};

export default kafkaConfig;
