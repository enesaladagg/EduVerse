const env = require('../config/env');

const allowedOrigins = env.corsOrigins.split(',').map((o) => o.trim());

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (env.nodeEnv === 'production') return false;
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

module.exports = { allowedOrigins, isOriginAllowed };
