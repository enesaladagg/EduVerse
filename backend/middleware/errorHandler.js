const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { classifyMongooseError } = require('../config/db');

const mapApplicationError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error?.name === 'ValidationError') {
    const details = Object.values(error.errors || {}).map((item) => item.message);
    return new AppError('Validation failed for request data.', 400, 'VALIDATION_ERROR', {
      fields: details,
    });
  }

  if (error?.name === 'CastError') {
    return new AppError('Invalid identifier or field format.', 400, 'INVALID_INPUT', {
      path: error.path,
      value: error.value,
    });
  }

  if (error?.name === 'MongoServerError' && error?.code === 11000) {
    const fields = Object.keys(error.keyPattern || {});
    return new AppError('A record with the same unique value already exists.', 409, 'DUPLICATE_RESOURCE', {
      fields,
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return new AppError('Malformed JSON request body.', 400, 'MALFORMED_JSON');
  }

  if (
    error?.name?.startsWith('Mongo')
    || error?.name?.startsWith('Mongoose')
    || /database|mongo|mongoose|server selection|timeout/i.test(error?.message || '')
  ) {
    return classifyMongooseError(error);
  }

  return new AppError('Unexpected server error', error?.statusCode || 500, 'INTERNAL_SERVER_ERROR', {
    originalMessage: error?.message,
  });
};

const errorHandler = (error, req, res, next) => {
  const handledError = mapApplicationError(error);

  logger.error('Request failed', {
    method: req.method,
    path: req.originalUrl,
    code: handledError.code,
    statusCode: handledError.statusCode,
    message: handledError.message,
  });

  const payload = {
    success: false,
    error: {
      code: handledError.code || 'INTERNAL_SERVER_ERROR',
      message: handledError.message || 'Unexpected server error',
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.error.details = handledError.details;
  }

  return res.status(handledError.statusCode || 500).json(payload);
};

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
