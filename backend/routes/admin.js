const express = require('express');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { authenticate, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Bütün admin rotaları authenticate ve admin rolü gerektirir
router.use(authenticate, authorize('admin'));

// @desc    Tüm kullanıcıları getir
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('name email role profilePicture gamification.points gamification.level gamification.badges createdAt')
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: users,
  });
}));

// @desc    Kullanıcı rolünü güncelle
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['student', 'teacher', 'admin'].includes(role)) {
    return next(new AppError('Geçersiz rol', 400, 'INVALID_ROLE'));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Kullanıcı bulunamadı', 404, 'USER_NOT_FOUND'));
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: 'Kullanıcı rolü güncellendi',
    data: user.toSafeObject(),
  });
}));

module.exports = router;
