process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-at-least-32-chars-long';

const request = require('supertest');
const app = require('../app');
const db = require('./helpers/db');

let teacherToken;
let studentToken;

const teacher = {
  name: 'Teacher User',
  email: 'teacher@example.com',
  password: 'TeacherPass123!',
  role: 'teacher',
};

const student = {
  name: 'Student User',
  email: 'student@example.com',
  password: 'StudentPass123!',
  role: 'student',
};

beforeAll(async () => {
  await db.connect();

  const teacherRes = await request(app).post('/api/auth/register').send(teacher);
  teacherToken = teacherRes.body.token;

  const studentRes = await request(app).post('/api/auth/register').send(student);
  studentToken = studentRes.body.token;
}, 30000);

afterAll(async () => {
  await db.disconnect();
}, 30000);

describe('GET /api/users', () => {
  it('returns user list for authenticated teacher', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('forbids access for students with 403', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_TOKEN_MISSING');
  });

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_TOKEN_INVALID');
  });

  it('does not expose passwords in user list', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${teacherToken}`);

    for (const user of res.body.data) {
      expect(user.password).toBeUndefined();
    }
  });
});

describe('GET /api/health', () => {
  it('returns 200 with connected database', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.database.status).toBe('connected');
  });
});

describe('Security headers', () => {
  it('sets X-Content-Type-Options header via helmet', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('sets X-Frame-Options header via helmet', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});
