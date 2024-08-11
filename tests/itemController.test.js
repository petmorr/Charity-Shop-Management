const request = require('supertest');
const app = require('../test-server');

const userSession = { user: { username: 'testuser', role: 'user' } };

describe('Item Management Controller Tests', () => {
  test('should render manage items page', async () => {
    const response = await request(app)
      .get('/manage-items')
      .set('Cookie', `session=${JSON.stringify(userSession)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array);
  });

  test('should add a new item', async () => {
    const response = await request(app)
      .post('/manage-items/api')
      .set('Cookie', `session=${JSON.stringify(userSession)}`)
      .send({ name: 'NewItem', description: 'NewDescription', price: 200, store: 'TestStore' });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Item added successfully');
  });

  test('should handle validation errors during item addition', async () => {
    const response = await request(app)
      .post('/manage-items/api')
      .set('Cookie', `session=${JSON.stringify(userSession)}`)
      .send({ name: '', description: '', price: '' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  test('should delete an item', async () => {
    const response = await request(app)
      .delete('/manage-items/api/someItemId')
      .set('Cookie', `session=${JSON.stringify(userSession)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Item deleted successfully');
  });
});