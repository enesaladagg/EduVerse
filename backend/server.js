const http = require('http');

const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { connectDatabase, disconnectDatabase } = require('./config/db');
const { initSocket } = require('./socket');

const server = http.createServer(app);

// Socket.io'yu HTTP sunucusuna bağla (WebRTC sinyalleşme + canlı etkileşim)
const io = initSocket(server);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(env.port, () => {
      logger.info('Server started', {
        port: env.port,
        nodeEnv: env.nodeEnv,
      });
    });
  } catch (error) {
    logger.error('Server bootstrap failed', {
      code: error.code,
      message: error.message,
    });
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  logger.warn('Shutdown signal received', { signal });

  // Önce yeni soket bağlantılarını kapat, mevcut olanları sonlandır
  io.close(() => {
    logger.info('Socket.io server closed');
  });

  server.close(async () => {
    try {
      await disconnectDatabase();
      logger.info('HTTP server closed gracefully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown', {
        message: error.message,
      });
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', {
    message: reason?.message || String(reason),
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    message: error.message,
  });
  process.exit(1);
});

startServer();
