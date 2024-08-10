const request = require('supertest');
const app = require('../test-server');  // Adjust this path as needed

describe('Manage Volunteers Controller Tests', () => {
  const managerSession = { user: { username: 'manager', role: 'manager' } };

  test('should render manage volunteers page', async () => {
    const response = await request(app)
      .get('/manage-volunteers')
      .set('Cookie', `session=${JSON.stringify(managerSession)}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Manage Volunteers');
  });

  test('should add a new volunteer', async () => {
    const response = await request(app)
      .post('/manage-volunteers/api')
      .send({ username: 'newvolunteer', password: 'volpassword', email: 'vol@example.com' });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Volunteer added successfully');
  });

  test('should not add a duplicate volunteer', async () => {
    const response = await request(app)
      .post('/manage-volunteers/api')
      .send({ username: 'volunteer1', password: 'volpassword', email: 'vol@example.com' });
    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('Username already exists');
  });

  test('should delete a volunteer', async () => {
    const response = await request(app)
      .delete('/manage-volunteers/api/somevolunteerid')
      .set('Cookie', `session=${JSON.stringify(managerSession)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Volunteer deleted successfully');
  });

  test('should handle unauthorized access to manage volunteers', async () => {
    const response = await request(app)
      .get('/manage-volunteers')
      .set('Cookie', `session=${JSON.stringify({ user: { username: 'volunteer', role: 'volunteer' } })}`);
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Unauthorized access');
  });
});