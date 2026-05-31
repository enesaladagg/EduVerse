const express = require('express');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Bu rotaların hepsi giriş yapmayı ve 'admin' olmayı gerektirir
router.use(protect);
router.use(authorizeRoles('admin'));

// GET /api/admin/users - Tüm kullanıcıları getir
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean();
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/admin/users/:id/role - Kullanıcı rolünü güncelle
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Geçersiz rol belirtildi' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/admin/users/:id - Kullanıcı sil
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }

    return res.json({ success: true, message: 'Kullanıcı silindi' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
