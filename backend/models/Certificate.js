const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    default: 'EduVerse',
  },
  hours: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 100,
  },
  skills: [{
    type: String
  }],
  color: {
    type: String,
    default: '#00d4aa'
  },
  certId: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);
