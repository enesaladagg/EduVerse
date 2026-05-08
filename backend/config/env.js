require('dotenv').config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set and at least 32 characters in production');
  }
}

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
  jwtSecret: jwtSecret || 'dev-only-insecure-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:5173',
};
