const express = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/users', authenticate, authorize('teacher'), async (req, res, next) => {
  try {
    const users = await User.find().select('name email role createdAt').lean();

    return res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
