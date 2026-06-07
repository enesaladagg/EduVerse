const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/courses/instructor-stats', authenticate, authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const myCourses = await Course.find({ teacherId }).select('_id');
  const courseIds = myCourses.map(c => c._id.toString());
  
  // Find students who have purchased at least one of these courses
  // purchasedCourses contains ObjectIds or Strings
  const totalStudents = await User.countDocuments({ purchasedCourses: { $in: courseIds } });
  
  res.json({
    success: true,
    data: {
      totalCourses: courseIds.length,
      totalStudents,
      monthlyRevenue: 24500, // Gerçek entegrasyon sonrası hesaplanacak
      averageRating: 4.8
    }
  });
}));

router.get('/courses', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const filter = { isActive: true };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.level) filter.level = req.query.level;
  if (req.query.teacherId) filter.teacherId = req.query.teacherId;
  if (req.query.q) filter.$text = { $search: req.query.q };

  const query = Course.find(filter)
    .select('title description teacherId category level thumbnail isActive createdAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const [courses, total] = await Promise.all([
    query,
    Course.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: courses.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
    data: courses,
  });
}));

module.exports = router;
