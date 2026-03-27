const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail:   { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
