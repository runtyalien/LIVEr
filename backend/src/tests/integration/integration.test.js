const request = require('supertest');
const app = require('../../app');
const { admin } = require('../../config/firebase');
const { client } = require('../../config/redis');

describe('Users API Integration', () => {
  let authToken, userId;

  beforeAll(async () => {
    userId = 'user-id';
    authToken = await admin.auth().createCustomToken(userId);
  });

  afterAll(async () => {
    await client.quit();
  });

  describe('Products Endpoint', () => {
    it('should fetch all products', async () => {
      const response = await request(app)
        .get('/api/v1/users/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fetch specific product', async () => {
      const productId = 'product-id';
      const response = await request(app)
        .get(`/api/v1/users/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', productId);
    });
  });

  describe('Recently Viewed Endpoint', () => {
    const productId = 'test-product-id';

    it('should record product view', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${userId}/recentlyViewed`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Product view recorded');
    });

    it('should fetch recently viewed products', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}/recentlyViewed`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle unauthorized access', async () => {
      await request(app)
        .get('/api/v1/users/products')
        .expect(401);
    });

    it('should handle non-existent product', async () => {
      const nonExistentProductId = 'non-existent-id';
      await request(app)
        .get(`/api/v1/users/products/${nonExistentProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});