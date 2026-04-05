const express = require('express');
const morgan = require('morgan');

const healthRoutes = require('./routes/health');
const usersRoutes = require('./routes/users');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api', healthRoutes);
app.use('/api', usersRoutes);

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Online egitim platformu backend is running',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
