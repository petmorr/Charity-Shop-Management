const request = require('supertest');
const app = require('../test-server');

describe('Authentication Controller Tests', () => {
  test('should render login page', async () => {
    const response = await request(app).get('/auth/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Login');
  });

  test('should login successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/auth/api/login')
      .set('Cookie', `session=${JSON.stringify(userSession)}`)
      .send({ username: 'testuser', password: 'testpassword' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Successfully logged in');
  });

  test('should render registration page', async () => {
    const response = await request(app).get('/auth/register');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Register');
  });

  test('should not register a duplicate user', async () => {
    await request(app)
      .post('/auth/api/register')
      .send({ username: 'testuser', password: 'newpassword', email: 'testuser@example.com' });

    const response = await request(app)
      .post('/auth/api/register')
      .send({ username: 'testuser', password: 'newpassword', email: 'testuser@example.com' });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('Username already exists');
  });

  test('should logout successfully', async () => {
    const response = await request(app).get('/auth/logout');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Successfully logged out');
  });
});