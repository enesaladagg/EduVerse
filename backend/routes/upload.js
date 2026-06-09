const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const router = express.Router();

// Uploads klasörü yoksa oluştur
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${req.user.id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Sadece JPG, PNG, WEBP veya GIF dosyaları yüklenebilir.', 400, 'INVALID_FILE_TYPE'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/upload/avatar
router.post(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError('Dosya yüklenmedi.', 400, 'NO_FILE'));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('Kullanıcı bulunamadı.', 404, 'USER_NOT_FOUND'));
    }

    // Eski avatar varsa sil
    if (user.profilePicture && user.profilePicture.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Yeni avatar URL'ini kaydet (/uploads/avatars/filename.jpg formatında)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.profilePicture = avatarUrl;
    await user.save();

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return res.json({
      success: true,
      data: {
        profilePicture: avatarUrl,
        profilePictureUrl: `${backendUrl}${avatarUrl}`,
      },
    });
  })
);

module.exports = router;
