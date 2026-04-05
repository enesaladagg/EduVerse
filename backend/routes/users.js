const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/users', async (req, res, next) => {
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
