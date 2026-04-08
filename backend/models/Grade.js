const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  teacherId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score:        { type: Number },
  feedback:     { type: String },
  gradedAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('Grade', GradeSchema);
