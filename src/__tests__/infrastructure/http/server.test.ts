import { FastifyInstance } from 'fastify';
import supertest from 'supertest';
import { createServer } from '../../../infrastructure/http/server';

describe('User API', () => {
  let server: FastifyInstance;
  let request: ReturnType<typeof supertest>

  beforeAll(async () => {
    server = createServer();
    await server.ready();
    request = supertest(server.server);
  });

  afterAll(async () => {
    await server.close();
  });

  test('POST /users should create a user', async () => {
    const response = await request
      .post('/users')
      .send({ id: '1', name: 'John Doe', email: 'john@example.com' })
      .expect(201);

    expect(response.body).toEqual({ message: 'User created' });
  });

  test('POST /users should return 400 for invalid email', async () => {
    const response = await request
      .post('/users')
      .send({ id: '2', name: 'Jane Doe', email: 'invalid' })
      .expect(400);

    expect(response.body).toEqual({ error: 'Invalid email address' });
  });

  test('GET /users/:id should return a user', async () => {
    // Créer un utilisateur d'abord
    await request
      .post('/users')
      .send({ id: '1', name: 'John Doe', email: 'john@example.com' });

    const response = await request.get('/users/1').expect(200);

    expect(response.body).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  test('GET /users/:id should return 404 for non-existent user', async () => {
    const response = await request.get('/users/999').expect(404);

    expect(response.body).toEqual({ error: 'User not found' });
  });
});