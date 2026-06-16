const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');

describe('Payment API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '9876543210'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.data).toHaveProperty('token');
      token = res.body.data.token;
      userId = res.body.data.user._id;
    });

    it('should not register with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/payment/initiate', () => {
    it('should initiate a payment', async () => {
      const res = await request(app)
        .post('/api/payment/initiate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'wallet_transfer',
          amount: 100,
          recipient: '9876543211',
          recipientName: 'Recipient Name',
          description: 'Test transfer'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.transaction).toHaveProperty('transactionId');
      expect(res.body.data.transaction.status).toBe('pending');
    });

    it('should fail with insufficient balance', async () => {
      const res = await request(app)
        .post('/api/payment/initiate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'wallet_transfer',
          amount: 10000,
          recipient: '9876543211'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/payment/transactions', () => {
    it('should get all transactions', async () => {
      const res = await request(app)
        .get('/api/payment/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('transactions');
      expect(res.body.data).toHaveProperty('pagination');
    });
  });
});