const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title:       { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  duration:    { type: Number, note: 'in minutes' },
  roomId:      { type: String },
  status:      { type: String, enum: ['scheduled', 'ongoing', 'ended'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
