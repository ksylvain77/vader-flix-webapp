const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'vaderflix_test';

// Create a test app instance
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import database and routes
const db = require('../models');
require('../routes/media.routes')(app);

// Setup and teardown
beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Media API Tests', () => {
  describe('GET /api/media', () => {
    test('should return empty array when no media exists', async () => {
      const response = await request(app)
        .get('/api/media')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/media/:id', () => {
    test('should return 404 for non-existent media', async () => {
      const response = await request(app)
        .get('/api/media/999999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
}); 