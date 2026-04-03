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

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    service: 'backend',
    database: {
      status: readyStateMap[readyState] || 'unknown',
      name: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
