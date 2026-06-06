const express = require('express');
const LiveSession = require('../models/LiveSession');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

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
