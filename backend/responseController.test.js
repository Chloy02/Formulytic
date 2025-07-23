const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Register a minimal User model for population
const User = mongoose.model('User', new mongoose.Schema({
  _id: String,
  username: String,
  role: String
}));

// Import the controller and model
const responseController = require('./controllers/responseController');
const Response = require('./models/responseModel');

// Mock authentication middleware that matches verifyToken behavior
function mockAuth(role = 'user', id = '6880d690be8d412ea7a16072') {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    req.user = { id, role };  // Simulate decoded token
    next();
  };
}

// Setup Express app for testing
function setupApp(role = 'user', id) {
  const app = express();
  app.use(bodyParser.json());
  // All routes use the same mockAuth middleware to match production routes
  app.post('/api/responses', mockAuth(role, id), responseController.submitResponse);
  app.post('/api/responses/draft', mockAuth(role, id), responseController.saveDraft);
  app.get('/api/responses/draft', mockAuth(role, id), responseController.getDraft);
  app.get('/api/responses', mockAuth(role, id), responseController.getAllResponses);
  app.get('/api/responses/:id', mockAuth(role, id), responseController.getResponseById);
  app.delete('/api/responses/:id', mockAuth(role, id), responseController.deleteResponse);
  return app;
}

describe('Response Controller', () => {
  let app;
  let responseId;
  let draftId;

  beforeAll(async () => {
    // Connect to in-memory MongoDB or test DB
    await mongoose.connect('mongodb://localhost:27017/formulytic_test', { useNewUrlParser: true, useUnifiedTopology: true });
    // Create User documents for population
    await User.create([
      { _id: userIds.user1, username: 'user1', role: 'user' },
      { _id: userIds.user2, username: 'user2', role: 'user' },
      { _id: userIds.user3, username: 'user3', role: 'user' },
      { _id: userIds.user4, username: 'user4', role: 'user' },
      { _id: userIds.user5, username: 'user5', role: 'user' },
      { _id: userIds.user6, username: 'user6', role: 'user' },
      { _id: userIds.user7, username: 'user7', role: 'user' },
      { _id: userIds.user8, username: 'user8', role: 'user' },
      { _id: userIds.user9, username: 'user9', role: 'user' },
      { _id: userIds.user10, username: 'user10', role: 'user' },
      { _id: userIds.user11, username: 'user11', role: 'user' },
      { _id: userIds.admin1, username: 'admin1', role: 'admin' },
      { _id: userIds.admin2, username: 'admin2', role: 'admin' },
      { _id: userIds.admin3, username: 'admin3', role: 'admin' },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Response.deleteMany({});
    await User.deleteMany({});
    // Recreate User documents for each test
    await User.create([
      { _id: userIds.user1, username: 'user1', role: 'user' },
      { _id: userIds.user2, username: 'user2', role: 'user' },
      { _id: userIds.user3, username: 'user3', role: 'user' },
      { _id: userIds.user4, username: 'user4', role: 'user' },
      { _id: userIds.user5, username: 'user5', role: 'user' },
      { _id: userIds.user6, username: 'user6', role: 'user' },
      { _id: userIds.user7, username: 'user7', role: 'user' },
      { _id: userIds.user8, username: 'user8', role: 'user' },
      { _id: userIds.user9, username: 'user9', role: 'user' },
      { _id: userIds.user10, username: 'user10', role: 'user' },
      { _id: userIds.user11, username: 'user11', role: 'user' },
      { _id: userIds.admin1, username: 'admin1', role: 'admin' },
      { _id: userIds.admin2, username: 'admin2', role: 'admin' },
      { _id: userIds.admin3, username: 'admin3', role: 'admin' },
    ]);
  });

  const userIds = {
    user1: '507f1f77bcf86cd799439011',
    user2: '507f1f77bcf86cd799439012',
    user3: '507f1f77bcf86cd799439013',
    user4: '507f1f77bcf86cd799439014',
    user5: '507f1f77bcf86cd799439015',
    user6: '507f1f77bcf86cd799439016',
    user7: '507f1f77bcf86cd799439017',
    user8: '507f1f77bcf86cd799439018',
    user9: '507f1f77bcf86cd799439019',
    user10: '507f1f77bcf86cd79943901a',
    user11: '507f1f77bcf86cd79943901b',
    admin1: '507f1f77bcf86cd799439021',
    admin2: '507f1f77bcf86cd799439022',
    admin3: '507f1f77bcf86cd799439023',
  };

  it('should submit a valid response', async () => {
    app = setupApp('user', userIds.user1);
    const validAnswers = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      age: 30,
      comments: "Test response"
    };
    const res = await request(app)
      .post('/api/responses')
      .set('Authorization', 'Bearer test-token')
      .send({ answers: validAnswers });
    expect(res.statusCode).toBe(201);
    expect(res.body.response).toHaveProperty('submittedBy', userIds.user1);
    expect(res.body.response).toHaveProperty('status', 'submitted');
    responseId = res.body.response._id;
  });

  it('should not submit an invalid response', async () => {
    app = setupApp('user', userIds.user2);
    const invalidAnswers = {
      name: "",  // Invalid: empty string
      email: "not-an-email",  // Invalid: not a valid email
      age: "invalid",  // Invalid: not a number
    };
    const res = await request(app)
      .post('/api/responses')
      .set('Authorization', 'Bearer test-token')
      .send({ answers: invalidAnswers });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Validation failed');
  });

  it('should save and retrieve a draft', async () => {
    app = setupApp('user', userIds.user3);
    const answers = {
      name: "Draft User",
      email: "draft@example.com",
      phone: "+1234567890",
      age: 25,
      comments: "Draft response"
    };
    let res = await request(app)
      .post('/api/responses/draft')
      .set('Authorization', 'Bearer test-token')
      .send({ answers });
    expect(res.statusCode).toBe(201);
    expect(res.body.response).toHaveProperty('status', 'draft');
    draftId = res.body.response._id;

    res = await request(app)
      .get('/api/responses/draft')
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', draftId);
  });

  it('should allow admin to get all submitted responses', async () => {
    app = setupApp('admin', userIds.admin1);
    // Insert a submitted response
    await Response.create({ submittedBy: userIds.user4, answers: {}, status: 'submitted' });
    const res = await request(app)
      .get('/api/responses')
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should deny non-admin from getting all responses', async () => {
    app = setupApp('user', userIds.user5);
    const res = await request(app)
      .get('/api/responses')
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to get a specific response by id', async () => {
    app = setupApp('admin', userIds.admin2);
    const created = await Response.create({ submittedBy: userIds.user6, answers: {}, status: 'submitted' });
    const res = await request(app)
      .get(`/api/responses/${created._id}`)
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('_id', created._id.toString());
  });

  it('should deny non-admin from getting a specific response', async () => {
    app = setupApp('user', userIds.user7);
    const created = await Response.create({ submittedBy: userIds.user8, answers: {}, status: 'submitted' });
    const res = await request(app)
      .get(`/api/responses/${created._id}`)
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to delete a response', async () => {
    app = setupApp('admin', userIds.admin3);
    const created = await Response.create({ submittedBy: userIds.user9, answers: {}, status: 'submitted' });
    const res = await request(app)
      .delete(`/api/responses/${created._id}`)
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Response deleted successfully');
  });

  it('should deny non-admin from deleting a response', async () => {
    app = setupApp('user', userIds.user10);
    const created = await Response.create({ submittedBy: userIds.user11, answers: {}, status: 'submitted' });
    const res = await request(app)
      .delete(`/api/responses/${created._id}`)
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(403);
  });
});
