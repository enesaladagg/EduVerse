const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./utils/logger');

const healthRoutes = require('./routes/health');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(require('express-status-monitor')());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined', { stream: logger.stream }));

app.use('/api', healthRoutes);
app.use('/api', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Online egitim platformu backend is running',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
