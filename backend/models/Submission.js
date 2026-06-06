const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl:      { type: String },
  content:      { type: String, trim: true },
  submittedAt:  { type: Date, default: Date.now },
  status:       { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' },
});

module.exports = mongoose.model('Submission', SubmissionSchema);
