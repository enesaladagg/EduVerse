const express = require('express');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { authenticate, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/users/me', authenticate, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found.', 404, 'USER_NOT_FOUND'));
  }
  return res.json({ success: true, data: user.toSafeObject() });
}));

router.put('/users/me', authenticate, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found.', 404, 'USER_NOT_FOUND'));
  }

  const { name, profilePicture } = req.body;
  if (name) user.name = String(name).slice(0, 100);
  if (profilePicture !== undefined) user.profilePicture = profilePicture;

  await user.save();
  return res.json({ success: true, data: user.toSafeObject() });
}));

router.get('/users', authenticate, authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name email role profilePicture points badges createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    success: true,
    count: users.length,
    data: users,
  });
}));

module.exports = router;
