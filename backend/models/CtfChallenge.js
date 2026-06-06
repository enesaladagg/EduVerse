const mongoose = require('mongoose');

const CtfChallengeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    points: { type: Number, default: 0, min: 0 },
    category: { type: String, trim: true },
    level: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CtfChallenge', CtfChallengeSchema);
