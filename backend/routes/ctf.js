const express = require('express');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const CtfChallenge = require('../models/CtfChallenge');
const Certificate = require('../models/Certificate');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const challenges = Object.freeze([
  {
    key: 'directory-traversal-101',
    title: 'Directory Traversal 101',
    category: 'web-security',
    level: 'beginner',
    points: 100,
    description:
      'Kullanıcıdan gelen dosya yolu girdilerinde ../ ve mutlak yol denemelerini tespit et.',
    safeBase: '/sandbox/public',
  },
  {
    key: 'jwt-tamper-detection',
    title: 'JWT Payload Tamper Detection',
    category: 'auth-security',
    level: 'intermediate',
    points: 150,
    description:
      'Rol yükseltme denemelerini güvenli doğrulama ile yakala; token içeriğine körü körüne güvenme.',
  },
]);

const traversalPatterns = [
  /\.\.[/\\]/,
  /%2e%2e/i,
  /%252e%252e/i,
  /(?:^|[/\\])etc[/\\]passwd/i,
  /^[a-z]:[/\\]/i,
  /^[/\\]/,
];

const normalizeCandidate = (value) => {
  const raw = String(value || '').replace(/\0/g, '');
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const evaluateDirectoryTraversal = (payload) => {
  const candidate = normalizeCandidate(payload?.path);
  const detected = traversalPatterns.some((pattern) => pattern.test(candidate));

  return {
    ok: true,
    vulnerable: detected,
    result: detected ? 'BLOCKED_TRAVERSAL_ATTEMPT' : 'SAFE_RELATIVE_PATH',
    message: detected
      ? 'Traversal denemesi kontrollü sandbox tarafından engellendi.'
      : 'Girdi güvenli göreli yol olarak değerlendirildi.',
    normalizedPath: candidate,
  };
};

const evaluateJwtTamper = (payload) => {
  const requestedRole = payload?.requestedRole;
  const allowed = ['student', 'teacher'].includes(requestedRole);

  return {
    ok: true,
    vulnerable: !allowed,
    result: allowed ? 'ROLE_ACCEPTED_FOR_LAB' : 'ROLE_ESCALATION_BLOCKED',
    message: allowed
      ? 'Rol laboratuvar politikasına göre kabul edildi.'
      : 'Yetkisiz rol yükseltme denemesi engellendi.',
  };
};

const evaluators = {
  'directory-traversal-101': evaluateDirectoryTraversal,
  'jwt-tamper-detection': evaluateJwtTamper,
};

router.use(authenticate);

router.get('/ctf/challenges', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    count: challenges.length,
    data: challenges,
  });
}));

router.post('/ctf/challenges/:key/run', asyncHandler(async (req, res, next) => {
  const challenge = challenges.find((item) => item.key === req.params.key);
  if (!challenge) {
    return next(new AppError('CTF challenge not found.', 404, 'CTF_CHALLENGE_NOT_FOUND'));
  }

  const evaluator = evaluators[challenge.key];
  const evaluation = evaluator(req.body);

  res.json({
    success: true,
    challenge: {
      key: challenge.key,
      title: challenge.title,
      points: challenge.points,
    },
    evaluation,
  });
}));

router.post('/ctf/challenges/:key/complete', asyncHandler(async (req, res, next) => {
  const challenge = challenges.find((item) => item.key === req.params.key);
  if (!challenge) {
    return next(new AppError('CTF challenge not found.', 404, 'CTF_CHALLENGE_NOT_FOUND'));
  }

  const evaluator = evaluators[challenge.key];
  const evaluation = evaluator(req.body);

  if (!evaluation.vulnerable) {
    return next(new AppError('Challenge condition was not demonstrated.', 400, 'CTF_CONDITION_NOT_MET'));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found.', 404, 'USER_NOT_FOUND'));
  }

  let lab = await CtfChallenge.findOne({ key: challenge.key }).lean();
  if (!lab) {
    const created = await CtfChallenge.create({
      key: challenge.key,
      title: challenge.title,
      points: challenge.points,
      category: challenge.category,
      level: challenge.level,
    });
    lab = created.toObject();
  }

  user.gamification = user.gamification || {};
  user.gamification.points = user.points ?? user.gamification.points ?? 0;
  user.gamification.level = user.gamification.level || 1;
  user.gamification.badges = user.gamification.badges || [];
  user.gamification.completedChallenges = user.gamification.completedChallenges || [];
  user.points = user.points ?? user.gamification.points ?? 0;
  user.badges = user.badges || [];
  user.completedLabs = user.completedLabs || [];

  const badgeKey = `ctf-${challenge.key}`;
  const completed = user.completedLabs.some((id) => String(id) === String(lab._id))
    || user.gamification.completedChallenges.some((item) => item.challengeKey === challenge.key);

  if (!completed) {
    user.points += challenge.points;
    user.gamification.points = user.points;
    user.gamification.level = Math.max(1, Math.floor(user.points / 500) + 1);
    user.completedLabs.push(lab._id);
    user.gamification.completedChallenges.push({
      challengeKey: challenge.key,
      score: challenge.points,
    });
    if (!user.badges.includes(badgeKey)) {
      user.badges.push(badgeKey);
    }
    user.gamification.badges.push({
      key: badgeKey,
      title: `${challenge.title} Tamamlandı`,
      description: `${challenge.points} CTF puanı kazanıldı.`,
    });
    
    await Promise.all([
      user.save(),
      Certificate.create({
        userId: user._id,
        title: `${challenge.title} Uzmanlığı`,
        issuer: 'EduVerse CTF Labs',
        hours: 10,
        score: challenge.points,
        skills: [challenge.category, 'Security', 'CTF'],
        color: '#ff6b6b',
        certId: `CTF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`
      })
    ]);
  }

  res.json({
    success: true,
    alreadyCompleted: completed,
    awardedPoints: completed ? 0 : challenge.points,
    data: user.toSafeObject(),
  });
}));

module.exports = router;
