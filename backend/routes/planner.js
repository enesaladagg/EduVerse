const express = require('express');
const router = express.Router();
const PlannerTask = require('../models/PlannerTask');
const PomodoroSession = require('../models/PomodoroSession');
const { authenticate } = require('../middleware/auth');

// Görevleri Getir
router.get('/tasks', authenticate, async (req, res, next) => {
  try {
    const tasks = await PlannerTask.find({ user: req.user.id }).sort('dueDate');
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
});

// Görev Ekle
router.post('/tasks', authenticate, async (req, res, next) => {
  try {
    const task = await PlannerTask.create({ ...req.body, user: req.user.id });
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// Görev Güncelle (Status vs)
router.put('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const task = await PlannerTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// Pomodoro Session Kaydet
// Görev Sil
router.delete('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    await PlannerTask.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post('/pomodoro', authenticate, async (req, res, next) => {
  try {
    const { duration, taskRef, status } = req.body;
    const session = await PomodoroSession.create({
      user: req.user.id,
      duration,
      taskRef,
      status
    });
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
});

// Pomodoro İstatistikleri Getir
router.get('/pomodoro/stats', authenticate, async (req, res, next) => {
  try {
    const sessions = await PomodoroSession.find({ user: req.user.id, status: 'completed' });
    const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);
    res.json({ success: true, data: { totalSessions: sessions.length, totalMinutes } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
