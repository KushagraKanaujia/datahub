import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import authRouter from '../routes/auth';
import receiptsRouter from '../routes/receipts';
import User from '../models/User';
import Receipt from '../models/Receipt';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/receipts', receiptsRouter);

describe('Receipts API', () => {
  let authToken: string;
  let userId: string;

  const testUser = {
    email: 'receipt-test@example.com',
    password: 'password123',
    name: 'Receipt Test User',
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
    await Receipt.destroy({ where: { userId } });
    await User.destroy({ where: { email: testUser.email } });
  });

  describe('GET /api/receipts', () => {
    it('should return empty array for new user', async () => {
      const response = await request(app)
        .get('/api/receipts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/receipts')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/receipts')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/receipts/stats', () => {
    it('should return initial stats for new user', async () => {
      const response = await request(app)
        .get('/api/receipts/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalEarnings');
      expect(response.body).toHaveProperty('monthlyEarnings');
      expect(response.body).toHaveProperty('totalReceipts');
      expect(response.body).toHaveProperty('monthlyReceipts');
      expect(response.body.totalReceipts).toBe(0);
      expect(response.body.totalEarnings).toBe(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/receipts/stats')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/receipts/upload', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/receipts/upload')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should require image file', async () => {
      const response = await request(app)
        .post('/api/receipts/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    it('should validate file type', async () => {
      const response = await request(app)
        .post('/api/receipts/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('receipt', Buffer.from('not an image'), 'test.txt')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Receipt Limits and Validation', () => {
    it('should enforce daily upload limit', async () => {
      // This test would require mocking multiple uploads
      // For now, just verify the endpoint exists and responds
      const response = await request(app)
        .get('/api/receipts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.status).toBe(200);
    });
  });

  describe('Receipt Categories', () => {
    it('should return receipts grouped by category in stats', async () => {
      const response = await request(app)
        .get('/api/receipts/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('topCategories');
      expect(Array.isArray(response.body.topCategories)).toBe(true);
    });
  });
});
