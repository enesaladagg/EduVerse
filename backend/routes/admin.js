const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const { authenticate, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Bütün admin rotaları authenticate ve admin rolü gerektirir
router.use(authenticate, authorize('admin'));

// @desc    Admin istatistiklerini getir
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const students = await User.countDocuments({ role: 'student' });
  const teachers = await User.countDocuments({ role: 'teacher' });
  const Course = require('../models/Course');
  const totalCourses = await Course.countDocuments();
  
  res.json({
    success: true,
    data: {
      totalUsers,
      students,
      teachers,
      totalCourses,
      monthlyRevenue: 125000, // Gerçek ödeme sistemi entegre olunca hesaplanacak
    }
  });
}));

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

// @desc    Kullanıcıyı sil
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Kullanıcı bulunamadı', 404, 'USER_NOT_FOUND'));
  }

  // Admin kendini silemesin
  if (user._id.toString() === req.user.id.toString()) {
    return next(new AppError('Kendi hesabınızı silemezsiniz', 400, 'CANNOT_DELETE_SELF'));
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'Kullanıcı başarıyla silindi',
  });
}));

// @desc    Kurs durumunu güncelle (Aktif/Pasif)
// @route   PUT /api/admin/courses/:id/status
// @access  Private/Admin
router.put('/courses/:id/status', asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Kurs bulunamadı', 404, 'COURSE_NOT_FOUND'));
  }

  course.isActive = Boolean(isActive);
  await course.save();

  res.json({
    success: true,
    message: `Kurs başarıyla ${course.isActive ? 'onaylandı/aktif edildi' : 'pasif yapıldı'}.`,
    data: course,
  });
}));

// @desc    Kursu tamamen sil
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
router.delete('/courses/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Kurs bulunamadı', 404, 'COURSE_NOT_FOUND'));
  }

  await course.deleteOne();

  res.json({
    success: true,
    message: 'Kurs başarıyla silindi',
  });
}));

// @desc    Bekleyen eğitmen başvurularını getir
// @route   GET /api/admin/applications/instructors
// @access  Private/Admin
router.get('/applications/instructors', asyncHandler(async (req, res) => {
  const applications = await User.find({ instructorStatus: 'pending' })
    .select('name email createdAt')
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
}));

// @desc    Eğitmen başvurusunu onayla
// @route   PUT /api/admin/applications/instructors/:id/approve
// @access  Private/Admin
router.put('/applications/instructors/:id/approve', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.instructorStatus !== 'pending') {
    return next(new AppError('Bekleyen başvuru bulunamadı', 404, 'APPLICATION_NOT_FOUND'));
  }

  user.role = 'teacher';
  user.instructorStatus = 'approved';
  await user.save();

  res.json({
    success: true,
    message: 'Eğitmen başvurusu onaylandı.',
  });
}));

// @desc    Eğitmen başvurusunu reddet
// @route   PUT /api/admin/applications/instructors/:id/reject
// @access  Private/Admin
router.put('/applications/instructors/:id/reject', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.instructorStatus !== 'pending') {
    return next(new AppError('Bekleyen başvuru bulunamadı', 404, 'APPLICATION_NOT_FOUND'));
  }

  user.instructorStatus = 'rejected';
  await user.save();

  res.json({
    success: true,
    message: 'Eğitmen başvurusu reddedildi.',
  });
}));

module.exports = router;
