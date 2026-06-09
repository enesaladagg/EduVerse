const express = require('express');
const LiveSession = require('../models/LiveSession');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Benzersiz bir oda kodu üretir. Format: EDU-XXXX (4 alfanumerik karakter)
 * Çakışma durumunda yeni bir kod denenir (max 10 deneme).
 */
async function generateUniqueRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Karıştırılabilecek karakterler çıkarıldı (0/O, 1/I)
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = 'EDU-';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const exists = await LiveSession.exists({ roomId: code });
    if (!exists) return code;
  }
  throw new Error('Benzersiz oda kodu üretilemedi');
}

// POST /api/sessions/create — Yeni canlı ders oluştur (sadece teacher rolü)
router.post(
  '/sessions/create',
  authenticate,
  authorize('teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const { title, courseId, scheduledAt, duration, sessionType } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'title ve courseId zorunludur.' },
      });
    }

    const roomId = await generateUniqueRoomId();

    const session = await LiveSession.create({
      title,
      courseId,
      scheduledAt: scheduledAt || new Date(),
      duration: duration || 60,
      sessionType: sessionType || 'lecture',
      roomId,
      hostId: req.user.id,
      status: 'ongoing',
    });

    res.status(201).json({ success: true, data: session });
  })
);

// GET /api/sessions/join/:roomCode — Oda koduna göre aktif oturumu bul
router.get(
  '/sessions/join/:roomCode',
  authenticate,
  asyncHandler(async (req, res) => {
    const { roomCode } = req.params;

    const session = await LiveSession.findOne({
      roomId: roomCode.toUpperCase(),
      status: { $in: ['ongoing', 'scheduled'] },
    })
      .populate('courseId', 'title category level description')
      .populate('hostId', 'name email')
      .lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Aktif oturum bulunamadı. Kod geçersiz veya ders sona erdi.' },
      });
    }

    res.json({ success: true, data: session });
  })
);

// PUT /api/sessions/:id/end — Dersi bitir (sadece host yapabilir)
router.put(
  '/sessions/:id/end',
  authenticate,
  asyncHandler(async (req, res) => {
    const session = await LiveSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Oturum bulunamadı.' },
      });
    }

    if (String(session.hostId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Yalnızca dersin sahibi oturumu bitirebilir.' },
      });
    }

    session.status = 'ended';
    await session.save();

    res.json({ success: true, data: session });
  })
);

router.get('/sessions', asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  else filter.status = { $in: ['ongoing', 'scheduled'] };

  const sessions = await LiveSession.find(filter)
    .populate('courseId', 'title category level')
    .sort({ scheduledAt: -1 })
    .lean();

  res.json({ success: true, count: sessions.length, data: sessions });
}));

router.get('/sessions/room/:roomId', asyncHandler(async (req, res) => {
  const session = await LiveSession.findOne({ roomId: req.params.roomId })
    .populate('courseId', 'title category level description')
    .lean();

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { code: 'SESSION_NOT_FOUND', message: 'Live session not found.' },
    });
  }

  res.json({ success: true, data: session });
}));

module.exports = router;
