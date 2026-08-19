const request = require('supertest');
const { app, connect, close, clearDatabase } = require('./setup');

let businessToken;
let userToken;
let productId;

beforeAll(async () => {
    await connect();

    const bizRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Biz User', email: 'biz@test.com', password: 'pass1234', role: 'business_owner' });
    businessToken = bizRes.body.token;

    const userRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Normal User', email: 'user@test.com', password: 'pass1234' });
    userToken = userRes.body.token;

    const productRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${businessToken}`)
        .send({
            name: 'Test Product',
            description: 'A great test product',
            category: 'Electronics',
            brand: 'TestBrand',
            price: 99.99,
            countInStock: 10,
            imageUrl: 'https://example.com/image.jpg',
        });
    productId = productRes.body._id;
});

afterAll(async () => {
    await clearDatabase();
    await close();
});

describe('Product Endpoints', () => {
    describe('POST /api/products', () => {
        it('should create a product when authenticated', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${businessToken}`)
                .send({
                    name: 'New Product',
                    description: 'Brand new',
                    category: 'Electronics',
                    brand: 'Brand',
                    price: 49.99,
                    countInStock: 5,
                    imageUrl: 'https://example.com/new.jpg',
                });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('New Product');
            expect(res.body.price).toBe(49.99);
            expect(res.body.createdBy).toBeDefined();
        });

        it('should reject unauthenticated requests', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    name: 'X', description: 'X', category: 'X',
                    brand: 'X', price: 1, countInStock: 1, imageUrl: 'x.jpg',
                });

            expect(res.status).toBe(401);
        });

        it('should reject missing required fields', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${businessToken}`)
                .send({ name: 'Incomplete' });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/products', () => {
        it('should return products with pagination', async () => {
            const res = await request(app).get('/api/products');

            expect(res.status).toBe(200);
            expect(res.body.products).toBeInstanceOf(Array);
            expect(res.body.products.length).toBeGreaterThanOrEqual(1);
            expect(res.body.page).toBe(1);
            expect(res.body.pages).toBeGreaterThanOrEqual(1);
        });

        it('should search by keyword', async () => {
            await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${businessToken}`)
                .send({
                    name: 'Laptop Pro', description: 'Laptop', category: 'Electronics',
                    brand: 'Tech', price: 999, countInStock: 5, imageUrl: 'x.jpg',
                });

            const res = await request(app).get('/api/products?keyword=laptop');

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBeGreaterThanOrEqual(1);
            expect(res.body.products[0].name).toBe('Laptop Pro');
        });

        it('should filter by category', async () => {
            await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${businessToken}`)
                .send({
                    name: 'Running Shoes', description: 'Shoes', category: 'Fashion',
                    brand: 'Nike', price: 120, countInStock: 10, imageUrl: 'x.jpg',
                });

            const res = await request(app).get('/api/products?category=Fashion');

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBeGreaterThanOrEqual(1);
            expect(res.body.products[0].category).toBe('Fashion');
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return a product by ID', async () => {
            const res = await request(app).get(`/api/products/${productId}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Test Product');
        });

        it('should return 404 for non-existent product', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app).get(`/api/products/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('should update own product', async () => {
            const res = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${businessToken}`)
                .send({ name: 'Updated Product', price: 149.99 });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Product');
            expect(res.body.price).toBe(149.99);
        });

        it('should reject update from non-owner', async () => {
            const res = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Hacked Product' });

            expect(res.status).toBe(403);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should delete own product', async () => {
            const createRes = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${businessToken}`)
                .send({
                    name: 'To Delete', description: 'x', category: 'x',
                    brand: 'x', price: 1, countInStock: 1, imageUrl: 'x.jpg',
                });

            const res = await request(app)
                .delete(`/api/products/${createRes.body._id}`)
                .set('Authorization', `Bearer ${businessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Product removed');
        });

        it('should reject delete from non-owner', async () => {
            const res = await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });

    describe('POST /api/products/:id/reviews', () => {
        it('should add a review', async () => {
            const res = await request(app)
                .post(`/api/products/${productId}/reviews`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ rating: 4, comment: 'Great product!' });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Review added');
        });

        it('should reject duplicate review from same user', async () => {
            const res = await request(app)
                .post(`/api/products/${productId}/reviews`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ rating: 5, comment: 'Second review' });

            expect(res.status).toBe(400);
        });
    });
});
