const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

let eventsInitialized = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const classifyMongooseError = (error) => {
  if (!error) {
    return new AppError('Unknown database error', 500, 'DB_UNKNOWN');
  }

  const message = error.message || 'Unknown database error';

  if (error.name === 'MongoServerSelectionError' || /server selection/i.test(message)) {
    return new AppError(
      'Database is unreachable. Please verify network access and MongoDB availability.',
      503,
      'DB_CONN_UNREACHABLE',
      { originalMessage: message }
    );
  }

  if (error.name === 'MongooseServerSelectionError') {
    return new AppError(
      'Database server could not be selected in time.',
      503,
      'DB_SERVER_SELECTION_TIMEOUT',
      { originalMessage: message }
    );
  }

  if (error.name === 'MongoNetworkTimeoutError' || /timed out|timeout/i.test(message)) {
    return new AppError(
      'Database request timed out. Try again in a moment.',
      504,
      'DB_TIMEOUT',
      { originalMessage: message }
    );
  }

  if (error.name === 'MongoServerError' && error.code === 18) {
    return new AppError(
      'Database authentication failed. Check database credentials.',
      500,
      'DB_AUTH_FAILED',
      { originalMessage: message }
    );
  }

  return new AppError('Unexpected database error occurred.', 500, 'DB_UNEXPECTED', {
    originalMessage: message,
  });
};

const getConnectionOptions = () => ({
  maxPoolSize: env.mongoMaxPoolSize,
  minPoolSize: env.mongoMinPoolSize,
  serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMs,
  socketTimeoutMS: env.mongoSocketTimeoutMs,
  connectTimeoutMS: env.mongoConnectTimeoutMs,
  waitQueueTimeoutMS: env.mongoWaitQueueTimeoutMs,
  heartbeatFrequencyMS: env.mongoHeartbeatFrequencyMs,
  autoIndex: env.nodeEnv !== 'production',
});

const initializeConnectionEvents = () => {
  if (eventsInitialized) return;

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established', {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection re-established');
  });

  mongoose.connection.on('error', (error) => {
    const mapped = classifyMongooseError(error);
    logger.error('MongoDB connection error', {
      code: mapped.code,
      message: mapped.message,
      originalMessage: error.message,
    });
  });

  eventsInitialized = true;
};

const connectDatabase = async () => {
  if (!env.mongoUri) {
    throw new AppError(
      'MONGO_URI is missing. Define it in backend/.env before starting the server.',
      500,
      'DB_URI_MISSING'
    );
  }

  initializeConnectionEvents();
  const options = getConnectionOptions();

  for (let attempt = 1; attempt <= env.dbConnectRetries; attempt += 1) {
    try {
      logger.info('Attempting MongoDB connection', {
        attempt,
        maxPoolSize: options.maxPoolSize,
        minPoolSize: options.minPoolSize,
        serverSelectionTimeoutMS: options.serverSelectionTimeoutMS,
      });

      await mongoose.connect(env.mongoUri, options);
      return mongoose.connection;
    } catch (error) {
      const mappedError = classifyMongooseError(error);
      const willRetry = attempt < env.dbConnectRetries;

      logger.error('MongoDB connection attempt failed', {
        attempt,
        code: mappedError.code,
        reason: mappedError.details?.originalMessage,
        willRetry,
      });

      if (!willRetry) {
        throw mappedError;
      }

      const delay = env.dbRetryBaseDelayMs * attempt;
      await sleep(delay);
    }
  }

  throw new AppError('Unable to initialize MongoDB connection.', 500, 'DB_CONN_FAILED');
};

const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  classifyMongooseError,
};
