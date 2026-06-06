const mongoose = require('mongoose');

const ClassGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinCode: { type: String, unique: true, required: true },
  educationLevel: {
    type: String,
    enum: ['preschool', 'primary', 'middle', 'high', 'university', 'adult', 'mixed'],
    default: 'mixed',
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ClassGroup', ClassGroupSchema);
