require('dotenv').config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI || '',
  mongoMaxPoolSize: toNumber(process.env.MONGO_MAX_POOL_SIZE, 20),
  mongoMinPoolSize: toNumber(process.env.MONGO_MIN_POOL_SIZE, 2),
  mongoServerSelectionTimeoutMs: toNumber(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 5000),
  mongoSocketTimeoutMs: toNumber(process.env.MONGO_SOCKET_TIMEOUT_MS, 45000),
  mongoConnectTimeoutMs: toNumber(process.env.MONGO_CONNECT_TIMEOUT_MS, 10000),
  mongoWaitQueueTimeoutMs: toNumber(process.env.MONGO_WAIT_QUEUE_TIMEOUT_MS, 3000),
  mongoHeartbeatFrequencyMs: toNumber(process.env.MONGO_HEARTBEAT_FREQUENCY_MS, 10000),
  dbConnectRetries: toNumber(process.env.DB_CONNECT_RETRIES, 3),
  dbRetryBaseDelayMs: toNumber(process.env.DB_RETRY_BASE_DELAY_MS, 1000),
};
