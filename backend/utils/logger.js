const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
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

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // All logs
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'info'
    }),
    // Error logs only
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'error'
    }),
    // Console output
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

// Provide backward compatibility with previous interface
module.exports = {
  info: (message, context) => logger.info(message, { context }),
  warn: (message, context) => logger.warn(message, { context }),
  error: (message, context) => logger.error(message, { context }),
  
  // Expose the raw winston logger for the stream capability (used by morgan)
  stream: {
    write: (message) => logger.info(message.trim())
  }
};
