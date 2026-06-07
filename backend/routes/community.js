const express = require('express');
const CommunityPost = require('../models/CommunityPost');
const AppError = require('../utils/AppError');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find()
    .populate('author', 'name profilePicture')
    .populate('comments.author', 'name profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, count: posts.length, data: posts });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;
  
  const post = await CommunityPost.create({
    author: req.user.id,
    title,
    content,
    category,
    tags: tags || []
  });

  const populatedPost = await CommunityPost.findById(post._id).populate('author', 'name profilePicture');
  res.status(201).json({ success: true, data: populatedPost });
}));

router.post('/:id/like', authenticate, asyncHandler(async (req, res, next) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const index = post.likes.indexOf(req.user.id);
  if (index === -1) {
    post.likes.push(req.user.id);
  } else {
    post.likes.splice(index, 1);
  }
  await post.save();

  res.json({ success: true, data: { likes: post.likes.length } });
}));

router.post('/:id/comments', authenticate, asyncHandler(async (req, res, next) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const { content } = req.body;
  post.comments.push({
    author: req.user.id,
    content
  });

  await post.save();
  res.json({ success: true, data: post.comments });
}));

module.exports = router;
