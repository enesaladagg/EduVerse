const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const session = require('express-session');
const passport = require('./config/passport');

const healthRoutes = require('./routes/health');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const coursesRoutes = require('./routes/courses');
const ctfRoutes = require('./routes/ctf');
const rssRoutes = require('./routes/rss');
const sessionsRoutes = require('./routes/sessions');
const assignmentsRoutes = require('./routes/assignments');
const socialRoutes = require('./routes/social');
const plannerRoutes = require('./routes/planner');
const paymentRoutes = require('./routes/payment');
const certificatesRoutes = require('./routes/certificates');
const communityRoutes = require('./routes/community');
const uploadRoutes = require('./routes/upload');
const aiRoutes = require('./routes/ai');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { isOriginAllowed } = require('./utils/corsOrigins');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new AppError('Not allowed by CORS policy.', 403, 'CORS_FORBIDDEN'));
      }
    },
    credentials: true,
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests, please try again later.' },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many auth attempts, please try again later.' },
  },
});

app.use(globalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(morgan('combined', { stream: logger.stream }));

// Static file serving for uploads
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.JWT_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// GEÇICI DEBUG: SMTP bağlantı testi — route'lardan önce, auth gerektirmez
app.get('/api/debug/smtp', async (req, res) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
  try {
    await transporter.verify();
    res.json({ ok: true, user: process.env.SMTP_USER, passLen: process.env.SMTP_PASS?.length });
  } catch (err) {
    res.json({ ok: false, error: err.message, code: err.code, user: process.env.SMTP_USER, passLen: process.env.SMTP_PASS?.length });
  }
});

app.use('/api', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', coursesRoutes);
app.use('/api', ctfRoutes);
app.use('/api', rssRoutes);
app.use('/api', sessionsRoutes);
app.use('/api', assignmentsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Online egitim platformu backend is running',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
