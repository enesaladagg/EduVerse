const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:    {
    type: String,
    enum: ['programming', 'cybersecurity', 'design', 'data-science', 'business', 'language', 'general'],
    default: 'general',
    index: true,
  },
  level:       {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
    index: true,
  },
  thumbnail:   { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

CourseSchema.index({ teacherId: 1, isActive: 1, createdAt: -1 });
CourseSchema.index({ category: 1, level: 1, isActive: 1 });
CourseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', CourseSchema);
