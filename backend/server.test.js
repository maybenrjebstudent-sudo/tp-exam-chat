const request = require('supertest');
const app = require('./server');

describe('Chat API', () => {
  describe('GET /api/messages', () => {
    it('should return all messages with success=true', async () => {
      const res = await request(app).get('/api/messages');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });
  });

  describe('POST /api/messages', () => {
    it('should create a new message', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ author: 'Alice', content: 'Hello World' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.author).toBe('Alice');
      expect(res.body.data.content).toBe('Hello World');
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.timestamp).toBeDefined();
    });

    it('should return 400 if author is missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ content: 'Hello' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if content is missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ author: 'Bob' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if both fields are missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
