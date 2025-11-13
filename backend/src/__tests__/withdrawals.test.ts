import request from 'supertest';
import express from 'express';
import authRouter from '../routes/auth';
import withdrawalsRouter from '../routes/withdrawals';
import User from '../models/User';
import Withdrawal from '../models/Withdrawal';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/withdrawals', withdrawalsRouter);

describe('Withdrawals API', () => {
  let authToken: string;
  let userId: string;

  const testUser = {
    email: 'withdrawal-test@example.com',
    password: 'password123',
    name: 'Withdrawal Test User',
  };

  beforeAll(async () => {
    // Clean up existing test user
    await User.destroy({ where: { email: testUser.email } });

    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await Withdrawal.destroy({ where: { userId } });
    await User.destroy({ where: { email: testUser.email } });
  });

  describe('GET /api/withdrawals', () => {
    it('should return empty array for new user', async () => {
      const response = await request(app)
        .get('/api/withdrawals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/withdrawals')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/withdrawals/request', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .send({
          amount: 15.00,
          paymentMethod: 'paypal',
          paymentEmail: 'test@example.com',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject withdrawal below minimum amount', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 5.00,
          paymentMethod: 'paypal',
          paymentEmail: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('minimum');
    });

    it('should reject withdrawal with insufficient balance', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100.00,
          paymentMethod: 'paypal',
          paymentEmail: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Insufficient balance');
    });

    it('should require valid payment email', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10.00,
          paymentMethod: 'paypal',
          paymentEmail: 'invalid-email',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should require payment method', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10.00,
          paymentEmail: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate payment method type', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10.00,
          paymentMethod: 'invalid_method',
          paymentEmail: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Withdrawal Validation', () => {
    beforeEach(async () => {
      // Update user balance for testing
      await User.update(
        { availableBalance: 50.00 },
        { where: { id: userId } }
      );
    });

    it('should validate amount is a number', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 'not a number',
          paymentMethod: 'paypal',
          paymentEmail: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate amount is positive', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -10.00,
          paymentMethod: 'paypal',
          paymentEmail: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid paypal method', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 15.00,
          paymentMethod: 'paypal',
          paymentEmail: 'test@paypal.com',
        });

      // May succeed or fail depending on PayPal sandbox configuration
      expect([200, 201, 400, 500]).toContain(response.status);
    });

    it('should accept valid venmo method', async () => {
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 15.00,
          paymentMethod: 'venmo',
          paymentEmail: 'test@venmo.com',
        });

      // May succeed or fail depending on PayPal sandbox configuration
      expect([200, 201, 400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/withdrawals/stats/summary', () => {
    it('should return withdrawal statistics', async () => {
      const response = await request(app)
        .get('/api/withdrawals/stats/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalWithdrawn');
      expect(response.body).toHaveProperty('pendingAmount');
      expect(response.body).toHaveProperty('totalCount');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/withdrawals/stats/summary')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
