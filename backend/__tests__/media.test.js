const request = require('supertest');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'vaderflix_test';
process.env.JWT_SECRET = 'DeathStarDesignFlaw';

// Create a test app instance
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import database and routes
const db = require('../models');
require('../routes/media.routes')(app);

let adminToken;

jest.setTimeout(20000); // Increase timeout to 20 seconds

// Setup and teardown
beforeAll(async () => {
  console.log('Starting test DB sync...');
  await db.sequelize.sync({ force: true });
  console.log('DB sync complete. Creating admin user...');
  // Create an admin user
  const adminUser = await db.users.create({
    username: 'admin',
    email: 'admin@test.com',
    password: 'irrelevant',
    role: 'admin',
    isActive: true
  });
  // Generate JWT for admin
  adminToken = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Admin user created and JWT generated.');
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

  describe('POST /api/media', () => {
    test('should create a new media item', async () => {
      const newMedia = {
        title: 'Test Movie',
        type: 'movie',
        tmdbId: 12345,
        year: 2024,
        description: 'A test movie for our test suite'
      };

      const response = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newMedia)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newMedia.title);
      expect(response.body.type).toBe(newMedia.type);
      expect(response.body.tmdbId).toBe(newMedia.tmdbId);
    });
  });
}); 