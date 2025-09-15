const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Root Controller', () => {
  afterAll(async () => {
    await mongoose.connection.close(); // Close MongoDB connection after tests
  });

  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Welcome to HFF Website API 🚀');
  });
});