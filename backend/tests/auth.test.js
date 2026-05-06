process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-at-least-32-chars-long';

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const db = require('./helpers/db');

beforeAll(async () => {
  await db.connect();
}, 30000);

afterAll(async () => {
  await db.disconnect();
}, 30000);

afterEach(async () => {
  await db.clear();
});

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'SecurePass123!',
  role: 'student',
};

describe('POST /api/auth/register', () => {
  it('creates a new user and returns a JWT', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe(validUser.email);
    expect(res.body.data.password).toBeUndefined();
  });

  it('rejects duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects short password with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid role with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, role: 'admin' });

    expect(res.status).toBe(400);
  });

  it('rejects invalid email with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('strips unknown fields (mass-assignment protection)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, isAdmin: true, __v: 999 });

    expect(res.status).toBe(201);
    const stored = await User.findOne({ email: validUser.email });
    expect(stored.isAdmin).toBeUndefined();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser);
  });

  it('returns a JWT on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('returns 401 on unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: validUser.password });

    expect(res.status).toBe(401);
  });

  it('does not return password in response', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.body.data.password).toBeUndefined();
  });
});

describe('NoSQL injection prevention', () => {
  it('sanitises $gt operator in login body', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $gt: '' }, password: validUser.password });

    expect(res.status).toBe(400);
  });
});
