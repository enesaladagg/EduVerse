const express = require('express');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const AppError = require('../utils/AppError');
const { authenticate, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/assignments', authenticate, asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.courseId) filter.courseId = req.query.courseId;

  const assignments = await Assignment.find(filter)
    .populate('courseId', 'title')
    .sort({ dueDate: 1 })
    .lean();

  const submissions = await Submission.find({ studentId: req.user.id }).lean();
  const submissionsMap = submissions.reduce((acc, sub) => {
    acc[sub.assignmentId] = sub;
    return acc;
  }, {});

  const data = assignments.map(a => ({
    ...a,
    mySubmission: submissionsMap[a._id] || null
  }));

  res.json({ success: true, count: data.length, data });
}));

router.post('/assignments', authenticate, authorize('teacher', 'admin'), asyncHandler(async (req, res, next) => {
  const { courseId, title, description, dueDate, maxScore } = req.body;
  if (!courseId || !title) {
    return next(new AppError('courseId and title are required.', 400, 'VALIDATION_ERROR'));
  }

  const assignment = await Assignment.create({
    courseId,
    title,
    description,
    dueDate,
    maxScore: maxScore || 100,
  });

  res.status(201).json({ success: true, data: assignment });
}));

router.post('/assignments/:id/submit', authenticate, authorize('student'), asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id).lean();
  if (!assignment) {
    return next(new AppError('Assignment not found.', 404, 'ASSIGNMENT_NOT_FOUND'));
  }

  const { content, fileUrl } = req.body;
  if (!content && !fileUrl) {
    return next(new AppError('content or fileUrl is required.', 400, 'VALIDATION_ERROR'));
  }

  const submission = await Submission.findOneAndUpdate(
    { assignmentId: assignment._id, studentId: req.user.id },
    {
      assignmentId: assignment._id,
      studentId: req.user.id,
      content: content || '',
      fileUrl: fileUrl || null,
      submittedAt: new Date(),
      status: 'submitted',
    },
    { upsert: true, new: true }
  );

  res.json({ success: true, data: submission });
}));

router.get('/assignments/:id/submissions/me', authenticate, asyncHandler(async (req, res) => {
  const submission = await Submission.findOne({
    assignmentId: req.params.id,
    studentId: req.user.id,
  }).lean();

  res.json({ success: true, data: submission });
}));

module.exports = router;
