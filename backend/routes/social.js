const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ClassGroup = require('../models/ClassGroup');
const { authenticate } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// Arkadaş Ekleme İsteği Gönder
router.post('/friends/request/:id', authenticate, asyncHandler(async (req, res, next) => {
  const targetUserId = req.params.id;
  if (targetUserId === req.user.id) return next(new AppError('Kendinize istek gönderemezsiniz.', 400));
  
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return next(new AppError('Kullanıcı bulunamadı.', 404));

  if (targetUser.friendRequests.includes(req.user.id)) {
    return next(new AppError('Zaten istek gönderilmiş.', 400));
  }
  if (targetUser.friends.includes(req.user.id)) {
    return next(new AppError('Zaten arkadaşsınız.', 400));
  }

  targetUser.friendRequests.push(req.user.id);
  await targetUser.save();

  res.json({ success: true, message: 'Arkadaşlık isteği gönderildi.' });
}));

// Arkadaşlık İsteğini Kabul Et
router.post('/friends/accept/:id', authenticate, asyncHandler(async (req, res, next) => {
  const senderId = req.params.id;
  const currentUser = await User.findById(req.user.id);
  const senderUser = await User.findById(senderId);

  if (!currentUser.friendRequests.includes(senderId)) {
    return next(new AppError('Böyle bir istek bulunamadı.', 404));
  }

  currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== senderId);
  currentUser.friends.push(senderId);
  if (senderUser) {
    senderUser.friends.push(currentUser._id);
    await senderUser.save();
  }
  await currentUser.save();

  res.json({ success: true, message: 'Arkadaşlık isteği kabul edildi.' });
}));

// Gelen Arkadaşlık İsteklerini Listele
router.get('/friends/requests', authenticate, asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id).populate('friendRequests', 'name profilePicture role');
  res.json({ success: true, data: currentUser.friendRequests });
}));

// Arkadaş Listesi
router.get('/friends', authenticate, asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id).populate('friends', 'name profilePicture role');
  res.json({ success: true, data: currentUser.friends });
}));


// Yeni DM Konuşması Oluştur (veya varsa getir)
router.post('/conversations', authenticate, asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError('userId gerekli.', 400));
  if (userId === req.user.id) return next(new AppError('Kendinizle konuşma başlatamazsınız.', 400));
  const targetUser = await User.findById(userId);
  if (!targetUser) return next(new AppError('Kullanıcı bulunamadı.', 404));

  // Zaten var mı?
  let conv = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [req.user.id, userId], $size: 2 }
  }).populate('participants', 'name profilePicture role');

  if (!conv) {
    conv = await Conversation.create({ isGroup: false, participants: [req.user.id, userId] });
    conv = await Conversation.findById(conv._id).populate('participants', 'name profilePicture role');
  }
  res.json({ success: true, data: conv });
}));

// Konuşmaları Getir
router.get('/conversations', authenticate, asyncHandler(async (req, res) => {
  const convs = await Conversation.find({ participants: req.user.id })
    .populate('participants', 'name profilePicture role')
    .populate('lastMessage')
    .sort('-updatedAt');
  res.json({ success: true, data: convs });
}));

// Mesajları Getir
router.get('/conversations/:id/messages', authenticate, asyncHandler(async (req, res) => {
  const msgs = await Message.find({ conversationId: req.params.id })
    .populate('sender', 'name profilePicture')
    .sort('createdAt');
  res.json({ success: true, data: msgs });
}));

// Mesaj Gönder
router.post('/conversations/:id/messages', authenticate, asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const conversationId = req.params.id;

  const conv = await Conversation.findById(conversationId);
  if (!conv) return next(new AppError('Konuşma bulunamadı', 404));

  const msg = await Message.create({
    conversationId,
    sender: req.user.id,
    content,
    readBy: [req.user.id]
  });

  conv.lastMessage = msg._id;
  await conv.save();

  res.json({ success: true, data: msg });
}));

// Kullanıcı Arama
router.get('/users/search', authenticate, asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json({ success: true, data: [] });
  const users = await User.find({ 
    name: { $regex: q, $options: 'i' }, 
    _id: { $ne: req.user.id } 
  }).select('name profilePicture role').limit(10);
  res.json({ success: true, data: users });
}));

// Grup Kurma
router.post('/groups', authenticate, asyncHandler(async (req, res) => {
  const { name, description, studentIds } = req.body;
  
  // Rastgele benzersiz bir kod üret (örn: AB12CD)
  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const group = await ClassGroup.create({
    name,
    description: description || '',
    creator: req.user.id,
    teachers: [req.user.id],
    students: studentIds || [],
    joinCode
  });

  // Grup için hemen bir konuşma oluştur
  const participants = [req.user.id, ...(studentIds || [])];
  const conv = await Conversation.create({
    isGroup: true,
    name,
    participants
  });

  res.json({ success: true, data: { group, conversation: conv } });
}));

module.exports = router;
