const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  courseId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrolledAt: { type: Date, default: Date.now },
  status:     { type: String, enum: ['active', 'dropped', 'completed'], default: 'active' },
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
