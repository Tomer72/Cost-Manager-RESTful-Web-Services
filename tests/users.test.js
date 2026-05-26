const request = require('supertest');
jest.mock('../users-service/config/db', () => jest.fn());
jest.mock('../users-service/models/user.model');

const app = require('../users-service/app');
const User = require('../users-service/models/user.model');

describe('Users Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/add', () => {
    it('creates a valid user', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue({ 
        id: 123, 
        first_name: 'John', 
        last_name: 'Doe', 
        birthday: '1990-01-01' 
      });

      const response = await request(app)
        .post('/api/add')
        .send({ id: 123, first_name: 'John', last_name: 'Doe', birthday: '1990-01-01' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('first_name', 'John');
    });

    it('rejects missing fields', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({ first_name: 'John' }); // missing id, last_name, birthday

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('rejects duplicate id', async () => {
      User.findOne.mockResolvedValue({ id: 123, first_name: 'Jane' });

      const response = await request(app)
        .post('/api/add')
        .send({ id: 123, first_name: 'John', last_name: 'Doe', birthday: '1990-01-01' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('GET /api/users', () => {
    it('returns an array', async () => {
      User.find.mockResolvedValue([{ id: 123, first_name: 'John' }]);

      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /api/users/:id', () => {
    it('returns user details', async () => {
      User.findOne.mockResolvedValue({ id: 123, first_name: 'John', total: 0 });

      const response = await request(app).get('/api/users/123');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('first_name', 'John');
    });

    it('includes total', async () => {
      // Per README, user endpoint should include total, so we expect it to be present
      User.findOne.mockResolvedValue({ id: 123, first_name: 'John', total: 150 });

      const response = await request(app).get('/api/users/123');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
    });

    it('returns error JSON for an unknown user', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).get('/api/users/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});

