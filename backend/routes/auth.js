const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { validate, schemas } = require('../middleware/validate');
const env = require('../config/env');
const asyncHandler = require('../middleware/asyncHandler');
const passport = require('passport');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

router.post('/register', validate(schemas.register), asyncHandler(async (req, res, next) => {
  const { name, email, password, applyInstructor } = req.body;

  const existing = await User.findOne({ email }).select('_id').lean();
  if (existing) {
    return next(new AppError('A user with this email already exists.', 409, 'DUPLICATE_RESOURCE'));
  }

  const role = 'student';
  const instructorStatus = applyInstructor ? 'pending' : 'none';

  const user = await User.create({ name, email, password, role, instructorStatus });
  const token = signToken(user);

  return res.status(201).json({
    success: true,
    token,
    data: user.toSafeObject(),
  });
}));

router.post('/login', validate(schemas.login), asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401, 'AUTH_INVALID_CREDENTIALS'));
  }

  const token = signToken(user);

  return res.json({
    success: true,
    token,
    data: user.toSafeObject(),
  });
}));

/** Canlı ders demo oturumu — geçici kullanıcı oluşturur ve JWT döner. */
router.post('/demo-session', asyncHandler(async (req, res) => {
  const { name = 'Demo Kullanıcı', role = 'student' } = req.body || {};
  const safeRole = ['student', 'teacher'].includes(role) ? role : 'student';

  const user = await User.create({
    name: String(name).slice(0, 80),
    email: `live-${Date.now()}-${crypto.randomBytes(3).toString('hex')}@eduflow.local`,
    password: crypto.randomBytes(32).toString('hex'),
    role: safeRole,
  });

  const token = jwt.sign(
    { sub: user._id, role: user.role, name: user.name, demo: true },
    env.jwtSecret,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    token,
    data: { ...user.toSafeObject(), demo: true },
  });
}));

// OAuth Error/Success Redirection Helper
const oauthRedirect = (req, res) => {
  const token = signToken(req.user);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  // Redirect to frontend with token in URL (Frontend will parse and remove it)
  res.redirect(`${clientUrl}/?token=${token}`);
};

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  oauthRedirect
);

// LinkedIn OAuth Routes
router.get('/linkedin', passport.authenticate('linkedin', { state: true }));
router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  oauthRedirect
);

module.exports = router;
