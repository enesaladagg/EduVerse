const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { validate, schemas } = require('../middleware/validate');
const env = require('../config/env');
const asyncHandler = require('../middleware/asyncHandler');
const passport = require('passport');
const sendEmail = require('../utils/email');
const { sendSms, smsReady } = require('../utils/sms');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const smtpReady = () => !!(process.env.SMTP_USER && process.env.SMTP_PASS);

// ─── Register ────────────────────────────────────────────────────────────────
router.post('/register', validate(schemas.register), asyncHandler(async (req, res, next) => {
  const { name, email, password, applyInstructor } = req.body;

  const existing = await User.findOne({ email }).select('_id').lean();
  if (existing) {
    return next(new AppError('A user with this email already exists.', 409, 'DUPLICATE_RESOURCE'));
  }

  const instructorStatus = applyInstructor ? 'pending' : 'none';
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
    instructorStatus,
    verificationCode,
    verificationCodeExpires,
    isVerified: false,
  });

  if (smtpReady()) {
    try {
      await sendEmail({
        email: user.email,
        subject: 'EduVerse - E-posta Doğrulama Kodunuz',
        template: 'verifyEmail',
        data: { name: user.name, code: verificationCode },
      });
    } catch (err) {
      console.error('Email gönderilemedi:', err.message);
    }
  } else {
    console.log(`[TEST] OTP for ${email}: ${verificationCode}`);
  }

  return res.status(201).json({
    success: true,
    message: 'Doğrulama kodu e-postanıza gönderildi.',
    requiresVerification: true,
    email: user.email,
  });
}));

// ─── Verify Email ─────────────────────────────────────────────────────────────
router.post('/verify-email', asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) return next(new AppError('Email ve kod gereklidir.', 400));

  const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires');
  if (!user) return next(new AppError('Kullanıcı bulunamadı.', 404));

  if (user.isVerified) return res.json({ success: true, message: 'Zaten doğrulandı.' });

  if (!user.verificationCode || user.verificationCode !== code) {
    return next(new AppError('Geçersiz doğrulama kodu.', 400));
  }

  if (!user.verificationCodeExpires || user.verificationCodeExpires < Date.now()) {
    return next(new AppError('Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.', 400, 'CODE_EXPIRED'));
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  const token = signToken(user);
  return res.json({ success: true, token, data: user.toSafeObject() });
}));

// ─── Resend Email Verification Code ────────────────────────────────────────────
router.post('/resend-email-otp', asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('E-posta adresi gereklidir.', 400));

  const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires');
  // Always return 200 to prevent email enumeration
  if (!user || user.isVerified) {
    return res.json({ success: true, message: 'Eğer hesap doğrulama bekliyorsa yeni bir kod gönderildi.' });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = verificationCode;
  user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika
  await user.save({ validateBeforeSave: false });

  if (smtpReady()) {
    try {
      await sendEmail({
        email: user.email,
        subject: 'EduVerse - Yeni Doğrulama Kodunuz',
        template: 'verifyEmail',
        data: { name: user.name, code: verificationCode },
      });
    } catch (err) {
      console.error('Email gönderilemedi:', err.message);
    }
  } else {
    console.log(`[TEST] Yeni OTP for ${email}: ${verificationCode}`);
  }

  return res.json({ success: true, message: 'Yeni doğrulama kodu e-postanıza gönderildi.' });
}));

// ─── Login ────────────────────────────────────────────────────────────────────
router.post('/login', validate(schemas.login), asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +isVerified');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401, 'AUTH_INVALID_CREDENTIALS'));
  }

  if (user.isVerified === false) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'NOT_VERIFIED',
        message: 'Lütfen giriş yapmadan önce hesabınızı doğrulayın.',
        requiresVerification: true,
        email: user.email,
      },
    });
  }

  const token = signToken(user);
  return res.json({ success: true, token, data: user.toSafeObject() });
}));

// ─── Register with Phone ──────────────────────────────────────────────────────
router.post('/register-phone', validate(schemas.registerPhone), asyncHandler(async (req, res, next) => {
  const { name, phone, password, applyInstructor } = req.body;

  const existing = await User.findOne({ phone }).select('_id').lean();
  if (existing) {
    return next(new AppError('Bu telefon numarası zaten kayıtlı.', 409, 'DUPLICATE_RESOURCE'));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

  const user = await User.create({
    name,
    phone,
    password,
    role: 'student',
    instructorStatus: applyInstructor ? 'pending' : 'none',
    phoneOtp: otp,
    phoneOtpExpires: expires,
    isPhoneVerified: false,
    isVerified: false,
  });

  await sendSms({
    to: phone,
    message: `EduVerse doğrulama kodunuz: ${otp}\nKod 10 dakika geçerlidir.`,
  });

  return res.status(201).json({
    success: true,
    message: 'SMS doğrulama kodu gönderildi.',
    requiresVerification: true,
    phone: user.phone,
  });
}));

// ─── Verify Phone OTP (Register) ──────────────────────────────────────────────
router.post('/verify-phone', asyncHandler(async (req, res, next) => {
  const { phone, code } = req.body;
  if (!phone || !code) return next(new AppError('Telefon ve kod gereklidir.', 400));

  const user = await User.findOne({ phone }).select('+phoneOtp +phoneOtpExpires');
  if (!user) return next(new AppError('Kullanıcı bulunamadı.', 404));

  if (user.isPhoneVerified) {
    const token = signToken(user);
    return res.json({ success: true, token, data: user.toSafeObject() });
  }

  if (!user.phoneOtp || user.phoneOtp !== code) {
    return next(new AppError('Geçersiz doğrulama kodu.', 400));
  }
  if (user.phoneOtpExpires < Date.now()) {
    return next(new AppError('Doğrulama kodu süresi dolmuş. Lütfen yeniden isteyin.', 400));
  }

  user.isPhoneVerified = true;
  user.isVerified = true;
  user.phoneOtp = undefined;
  user.phoneOtpExpires = undefined;
  await user.save();

  const token = signToken(user);
  return res.json({ success: true, token, data: user.toSafeObject() });
}));

// ─── Send Phone OTP (Login) ───────────────────────────────────────────────────
router.post('/send-phone-otp', validate(schemas.sendPhoneOtp), asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return next(new AppError('Bu telefon numarasına kayıtlı hesap bulunamadı.', 404));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.phoneOtp = otp;
  user.phoneOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendSms({
    to: phone,
    message: `EduVerse giriş kodunuz: ${otp}\nKod 10 dakika geçerlidir.`,
  });

  return res.json({ success: true, message: 'SMS giriş kodu gönderildi.' });
}));

// ─── Login with Phone OTP ─────────────────────────────────────────────────────
router.post('/login-phone', asyncHandler(async (req, res, next) => {
  const { phone, code } = req.body;
  if (!phone || !code) return next(new AppError('Telefon ve kod gereklidir.', 400));

  const user = await User.findOne({ phone }).select('+phoneOtp +phoneOtpExpires');
  if (!user) return next(new AppError('Kullanıcı bulunamadı.', 404));

  if (!user.phoneOtp || user.phoneOtp !== code) {
    return next(new AppError('Geçersiz giriş kodu.', 400));
  }
  if (user.phoneOtpExpires < Date.now()) {
    return next(new AppError('Giriş kodunun süresi dolmuş. Lütfen yeniden isteyin.', 400));
  }

  user.phoneOtp = undefined;
  user.phoneOtpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user);
  return res.json({ success: true, token, data: user.toSafeObject() });
}));

// ─── Forgot Password ──────────────────────────────────────────────────────────
router.post('/forgot-password', asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('E-posta adresi gereklidir.', 400));

  const user = await User.findOne({ email });
  // Always return 200 to prevent email enumeration
  if (!user) {
    return res.json({
      success: true,
      message: 'Eğer bu e-posta kayıtlıysa şifre sıfırlama bağlantısı gönderildi.',
    });
  }

  // Generate a plain token, store its hash
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/?action=reset-password&token=${rawToken}`;

  if (smtpReady()) {
    try {
      await sendEmail({
        email: user.email,
        subject: 'EduVerse - Şifre Sıfırlama Bağlantısı',
        template: 'resetPassword',
        data: { name: user.name, resetUrl },
      });
    } catch (err) {
      // Roll back token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Reset email gönderilemedi:', err.message);
      return next(new AppError('E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.', 500));
    }
  } else {
    console.log(`[TEST] Reset URL for ${email}: ${resetUrl}`);
  }

  return res.json({
    success: true,
    message: 'Eğer bu e-posta kayıtlıysa şifre sıfırlama bağlantısı gönderildi.',
  });
}));

// ─── Reset Password ───────────────────────────────────────────────────────────
router.post('/reset-password/:token', asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
    return next(new AppError('Şifre en az 8 karakter olmalıdır.', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    return next(new AppError('Geçersiz veya süresi dolmuş sıfırlama bağlantısı.', 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.isVerified = true; // also verify the account if it wasn't
  await user.save();

  const token = signToken(user);
  return res.json({
    success: true,
    message: 'Şifreniz başarıyla güncellendi.',
    token,
    data: user.toSafeObject(),
  });
}));

// ─── Demo Session ──────────────────────────────────────────────────────────────
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

// ─── OAuth Helpers ─────────────────────────────────────────────────────────────
const oauthRedirect = (req, res) => {
  const token = signToken(req.user);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientUrl}/?token=${token}`);
};

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const linkedinConfigured = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.get('/google', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth henüz yapılandırılmamış. Lütfen .env dosyasına GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET ekleyin.',
      },
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

// ─── LinkedIn OAuth ───────────────────────────────────────────────────────────
router.get('/linkedin', (req, res, next) => {
  if (!linkedinConfigured) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'LinkedIn OAuth henüz yapılandırılmamış. Lütfen .env dosyasına LINKEDIN_CLIENT_ID ve LINKEDIN_CLIENT_SECRET ekleyin.',
      },
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
