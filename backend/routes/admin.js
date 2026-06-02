const express = require('express');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Bütün admin rotaları authenticate ve admin rolü gerektirir
router.use(authenticate, authorize('admin'));

// @desc    Tüm kullanıcıları getir
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      data: users.map(user => user.toSafeObject()),
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Kullanıcı rolünü güncelle
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return next(new AppError('Geçersiz rol', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('Kullanıcı bulunamadı', 404));
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'Kullanıcı rolü güncellendi',
      data: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
