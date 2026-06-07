const express = require('express');
const Certificate = require('../models/Certificate');
const AppError = require('../utils/AppError');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// GET /api/certificates/me — Kullanıcının sertifikalarını getir
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, count: certificates.length, data: certificates });
}));

// POST /api/certificates (Mock endpoint to grant a cert for testing/ctf completion)
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { title, hours, score, skills, color } = req.body;
  
  const certId = `CERT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  
  const certificate = await Certificate.create({
    userId: req.user.id,
    title,
    hours,
    score,
    skills,
    color,
    certId
  });

  res.status(201).json({ success: true, data: certificate });
}));

// GET /api/certificates/verify/:certId — Sertifika doğrulama (herkese açık)
router.get('/verify/:certId', asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findOne({ certId: req.params.certId })
    .populate('userId', 'name')
    .lean();

  if (!certificate) {
    return next(new AppError('Certificate not found or invalid.', 404, 'CERT_NOT_FOUND'));
  }

  res.json({ success: true, data: certificate });
}));

module.exports = router;
