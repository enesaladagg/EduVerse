const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    phoneOtp: {
      type: String,
      select: false,
    },
    phoneOtpExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    linkedinId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'parent'],
      required: true,
      default: 'student',
    },
    instructorStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    educationLevel: {
      type: String,
      enum: ['preschool', 'primary', 'middle', 'high', 'university', 'adult'],
      default: 'adult',
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    childrenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profilePicture: { type: String },
    points: { type: Number, default: 0, min: 0 },
    badges: { type: [String], default: [] },
    streak: { type: Number, default: 0, min: 0 },
    purchasedCourses: { type: [String], default: [] },
    completedLabs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CtfChallenge' }],
    gamification: {
      points: { type: Number, default: 0, min: 0 },
      level: { type: Number, default: 1, min: 1 },
      badges: [
        {
          key: { type: String, required: true, trim: true },
          title: { type: String, required: true, trim: true },
          description: { type: String, trim: true },
          earnedAt: { type: Date, default: Date.now },
        },
      ],
      completedChallenges: [
        {
          challengeKey: { type: String, required: true, trim: true },
          completedAt: { type: Date, default: Date.now },
          score: { type: Number, default: 0, min: 0 },
        },
      ],
    },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ points: -1 });
UserSchema.index({ badges: 1 });
UserSchema.index({ 'gamification.points': -1 });
UserSchema.index({ 'gamification.badges.key': 1 });

UserSchema.pre('save', function syncGamificationFields(next) {
  if (this.gamification?.points != null && !this.isModified('points')) {
    this.points = this.gamification.points;
  }
  if (this.isModified('points')) {
    this.gamification = this.gamification || {};
    this.gamification.points = this.points;
  }
  if (Array.isArray(this.badges) && this.badges.length) {
    this.gamification = this.gamification || {};
    const existingKeys = new Set((this.gamification.badges || []).map((b) => b.key));
    this.badges.forEach((key) => {
      if (!existingKeys.has(key)) {
        this.gamification.badges.push({ key, title: key, description: '' });
      }
    });
  }
  return next();
});

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    isPhoneVerified: this.isPhoneVerified,
    role: this.role,
    instructorStatus: this.instructorStatus,
    educationLevel: this.educationLevel,
    friends: this.friends,
    childrenIds: this.childrenIds,
    profilePicture: this.profilePicture,
    points: this.points ?? this.gamification?.points ?? 0,
    badges: this.badges?.length ? this.badges : (this.gamification?.badges || []).map((b) => b.key),
    streak: this.streak || 0,
    purchasedCourses: this.purchasedCourses || [],
    completedLabs: this.completedLabs || [],
    gamification: {
      points: this.points ?? this.gamification?.points ?? 0,
      level: this.gamification?.level || 1,
      badges: this.gamification?.badges || [],
    },
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
