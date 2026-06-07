#!/usr/bin/env node
/**
 * Veritabanını demo içerikle doldurur.
 * Kullanım: npm run db:seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const env = require('../config/env');
const { connectDatabase, disconnectDatabase } = require('../config/db');

const User = require('../models/User');
const Course = require('../models/Course');
const LiveSession = require('../models/LiveSession');
const Assignment = require('../models/Assignment');
const CtfChallenge = require('../models/CtfChallenge');

const DEMO_PASSWORD = 'Demo12345!';

const COURSES = [
  {
    title: 'React ile Modern Web Geliştirme',
    description: 'Hooks, state yönetimi ve canlı kod laboratuvarları.',
    category: 'programming',
    level: 'intermediate',
  },
  {
    title: 'Python ile Veri Bilimi',
    description: 'Pandas, NumPy ve görselleştirme temelleri.',
    category: 'data-science',
    level: 'beginner',
  },
  {
    title: 'Siber Güvenliğe Giriş',
    description: 'CTF laboratuvarları ve etik hacking pratikleri.',
    category: 'cybersecurity',
    level: 'beginner',
  },
  {
    title: 'Node.js Backend Mastery',
    description: 'Express, MongoDB ve Socket.io ile gerçek zamanlı API.',
    category: 'programming',
    level: 'advanced',
  },
];

const CTF_LABS = [
  { key: 'directory-traversal-101', title: 'Directory Traversal 101', points: 100, category: 'web-security', level: 'beginner' },
  { key: 'jwt-tamper-detection', title: 'JWT Payload Tamper Detection', points: 150, category: 'auth-security', level: 'intermediate' },
];

async function upsertUser({ name, email, role, points = 0, badges = [] }) {
  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.role = role;
    existing.points = points;
    existing.badges = badges;
    existing.password = DEMO_PASSWORD;
    await existing.save();
    return existing;
  }
  return User.create({ name, email, password: DEMO_PASSWORD, role, points, badges });
}

async function seed() {
  await connectDatabase();
  console.log('Seeding database…');

  const teacher = await upsertUser({
    name: 'Dr. Elif Yıldız',
    email: 'teacher@demo.com',
    role: 'teacher',
    points: 1200,
    badges: ['first_login', 'webrtc'],
  });

  const student = await upsertUser({
    name: 'Enes Aladağ',
    email: 'student@demo.com',
    role: 'student',
    points: 875,
    badges: ['first_login', 'first_course', 'streak_3', 'code_first'],
  });

  const admin = await upsertUser({
    name: 'Sistem Yöneticisi',
    email: 'admin@demo.com',
    role: 'admin',
    points: 9999,
    badges: ['founder', 'admin'],
  });

  await Course.deleteMany({});
  const courses = await Course.insertMany(
    COURSES.map((c) => ({ ...c, teacherId: teacher._id, isActive: true }))
  );

  await LiveSession.deleteMany({});
  await LiveSession.create({
    courseId: courses[0]._id,
    title: 'State Yönetimi & Hooks',
    scheduledAt: new Date(),
    duration: 90,
    roomId: 'react-101-live',
    status: 'ongoing',
    sessionType: 'lecture',
    hostId: teacher._id,
  });

  await Assignment.deleteMany({});
  await Assignment.insertMany([
    {
      courseId: courses[0]._id,
      title: 'useState ve useEffect Alıştırması',
      description: 'Counter ve todo list örneği geliştirin.',
      dueDate: new Date(Date.now() + 7 * 86400000),
      maxScore: 100,
    },
    {
      courseId: courses[2]._id,
      title: 'Directory Traversal Lab Raporu',
      description: 'CTF lab sonuçlarınızı özetleyin.',
      dueDate: new Date(Date.now() + 14 * 86400000),
      maxScore: 100,
    },
  ]);

  for (const lab of CTF_LABS) {
    await CtfChallenge.findOneAndUpdate({ key: lab.key }, lab, { upsert: true });
  }

  console.log('\n✓ Seed tamamlandı\n');
  console.log('Demo hesaplar:');
  console.log(`  Yönetici → admin@demo.com / ${DEMO_PASSWORD}`);
  console.log(`  Eğitmen  → teacher@demo.com / ${DEMO_PASSWORD}`);
  console.log(`  Öğrenci  → student@demo.com / ${DEMO_PASSWORD}`);
  console.log(`  Canlı oda → react-101-live\n`);

  await disconnectDatabase();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
