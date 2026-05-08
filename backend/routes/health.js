const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/health', (req, res) => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const readyState = mongoose.connection.readyState;
  const isHealthy = readyState === 1;
  const isProduction = process.env.NODE_ENV === 'production';

  const dbInfo = isProduction
    ? { status: readyStateMap[readyState] || 'unknown' }
    : {
        status: readyStateMap[readyState] || 'unknown',
        name: mongoose.connection.name || null,
        host: mongoose.connection.host || null,
      };

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    service: 'backend',
    database: dbInfo,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
