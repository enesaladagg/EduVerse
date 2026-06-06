const path = require('path');
const fs = require('fs');
const winston = require('winston');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf((info) => {
    const contextStr = info.context ? ` ${JSON.stringify(info.context)}` : '';
    return `[${info.level}] ${info.timestamp}: ${info.message}${contextStr}`;
  })
);

const logsDir = path.join(__dirname, '../logs');
fs.mkdirSync(logsDir, { recursive: true });

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  exitOnError: false,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

module.exports = {
  info: (message, context) => logger.info(message, { context }),
  warn: (message, context) => logger.warn(message, { context }),
  error: (message, context) => logger.error(message, { context }),
  debug: (message, context) => logger.debug(message, { context }),
  raw: logger,
  stream: {
    write: (message) => logger.info(message.trim()),
  },
};
