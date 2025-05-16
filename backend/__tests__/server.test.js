const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create a test app instance
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add the test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vader Flix API' });
});

describe('Server Tests', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Welcome to Vader Flix API'
    });
  });
}); 