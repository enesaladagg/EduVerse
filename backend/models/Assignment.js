const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  dueDate:     { type: Date },
  maxScore:    { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
