const mongoose = require('mongoose');

const PomodoroSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true }, // in minutes
  completedAt: { type: Date, default: Date.now },
  taskRef: { type: mongoose.Schema.Types.ObjectId, ref: 'PlannerTask' }, // Optional link to a task
  status: {
    type: String,
    enum: ['completed', 'interrupted'],
    default: 'completed'
  }
}, { timestamps: true });

module.exports = mongoose.model('PomodoroSession', PomodoroSessionSchema);
