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
const sendEmail = require('../utils/email');

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

  // 6 haneli OTP kodu üret
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({ 
    name, 
    email, 
    password, 
    role, 
    instructorStatus,
    verificationCode,
    isVerified: false
  });

  // Kullanıcıya email gönder (Eğer SMTP ayarları varsa)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await sendEmail({
        email: user.email,
        subject: 'EduVerse - Doğrulama Kodunuz',
        message: `EduVerse'e hoş geldiniz!\n\nHesabınızı doğrulamak için kodunuz: ${verificationCode}\n\nİyi öğrenmeler dileriz.`
      });
    } catch (err) {
      console.error('Email gönderilemedi:', err);
    }
  } else {
    // Test amaçlı konsola bas
    console.log(`[TEST] OTP for ${email} is: ${verificationCode}`);
  }

  return res.status(201).json({
    success: true,
    message: 'Doğrulama kodu e-postanıza gönderildi.',
    requiresVerification: true,
    email: user.email
  });
}));

router.post('/verify-email', asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) return next(new AppError('Email ve kod gereklidir.', 400));

  const user = await User.findOne({ email }).select('+verificationCode');
  if (!user) return next(new AppError('Kullanıcı bulunamadı.', 404));

  if (user.isVerified) return res.json({ success: true, message: 'Zaten doğrulandı.' });

  if (user.verificationCode !== code) {
    return next(new AppError('Geçersiz doğrulama kodu.', 400));
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  await user.save();

  const token = signToken(user);

  return res.json({
    success: true,
    token,
    data: user.toSafeObject()
  });
}));

router.post('/login', validate(schemas.login), asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +isVerified');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401, 'AUTH_INVALID_CREDENTIALS'));
  }

  // Eğer hesap onaylı değilse
  if (user.isVerified === false) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'NOT_VERIFIED',
        message: 'Lütfen giriş yapmadan önce hesabınızı doğrulayın.',
        requiresVerification: true,
        email: user.email
      }
    });
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
const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const linkedinConfigured = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);

router.get('/google', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth henüz yapılandırılmamış. Lütfen .env dosyasına GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET ekleyin.'
      }
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!googleConfigured) return res.redirect('/login?error=oauth_not_configured');
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }, (err, user) => {
    if (err || !user) return res.redirect('/login?error=oauth_failed');
    req.user = user;
    oauthRedirect(req, res);
  })(req, res, next);
});

// LinkedIn OAuth Routes
router.get('/linkedin', (req, res, next) => {
  if (!linkedinConfigured) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'LinkedIn OAuth henüz yapılandırılmamış. Lütfen .env dosyasına LINKEDIN_CLIENT_ID ve LINKEDIN_CLIENT_SECRET ekleyin.'
      }
    });
  }
  passport.authenticate('linkedin', { state: true })(req, res, next);
});

router.get('/linkedin/callback', (req, res, next) => {
  if (!linkedinConfigured) return res.redirect('/login?error=oauth_not_configured');
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login?error=oauth_failed' }, (err, user) => {
    if (err || !user) return res.redirect('/login?error=oauth_failed');
    req.user = user;
    oauthRedirect(req, res);
  })(req, res, next);
});

module.exports = router;
