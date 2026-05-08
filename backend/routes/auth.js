const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { validate, schemas } = require('../middleware/validate');
const env = require('../config/env');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

router.post('/register', validate(schemas.register), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError('A user with this email already exists.', 409, 'DUPLICATE_RESOURCE'));
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      token,
      data: user.toSafeObject(),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', validate(schemas.login), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password.', 401, 'AUTH_INVALID_CREDENTIALS'));
    }

    const token = signToken(user);

    return res.json({
      success: true,
      token,
      data: user.toSafeObject(),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
