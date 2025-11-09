import config from '.';

const brokers = config.kafka_brokers?.split(',').map(b => b.trim());

const kafkaConfig = {
  clientId: 'product-service',
  brokers,
  numPartitions: Number(config.number_of_partition) || 12,
  replicationFactor: Number(config.replication_factor) || 3,
};

export default kafkaConfig;
