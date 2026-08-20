const request = require('supertest');
const { app, connect, close, clearDatabase } = require('./setup');

let userToken, userId;
let adminToken;
let productId;

beforeAll(async () => {
    await connect();

    const userRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Order User', email: 'order@test.com', password: 'pass1234' });
    userToken = userRes.body.token;
    userId = userRes.body._id;

    const adminRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Admin', email: 'admin@test.com', password: 'pass1234', role: 'admin' });
    adminToken = adminRes.body.token;

    const bizRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Biz', email: 'bizorder@test.com', password: 'pass1234', role: 'business_owner' });

    const productRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${bizRes.body.token}`)
        .send({
            name: 'Order Product',
            description: 'For order testing',
            category: 'Test',
            brand: 'Test',
            price: 75.00,
            countInStock: 10,
            imageUrl: 'https://example.com/img.jpg',
        });
    productId = productRes.body._id;

    await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 });
});

afterAll(async () => {
    await clearDatabase();
    await close();
});

describe('Order Endpoints', () => {
    describe('POST /api/orders', () => {
        it('should create an order from cart', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    shippingAddress: { address: '123 Main St', city: 'Harare', postalCode: '00263', country: 'Zimbabwe' },
                    paymentMethod: 'paystack',
                });

            expect(res.status).toBe(201);
            expect(res.body.shippingAddress.city).toBe('Harare');
            expect(res.body.paymentMethod).toBe('paystack');
            expect(res.body.isPaid).toBe(false);
            expect(res.body.isDelivered).toBe(false);
            expect(res.body.totalPrice).toBe(50165);
        });

        it('should reject empty cart order', async () => {
            const otherUser = await request(app)
                .post('/api/users/register')
                .send({ name: 'Empty', email: 'empty@test.com', password: 'pass1234' });

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${otherUser.body.token}`)
                .send({
                    shippingAddress: { address: '123 Main St', city: 'Harare', postalCode: '00263', country: 'Zimbabwe' },
                    paymentMethod: 'paystack',
                });

            expect(res.status).toBe(400);
        });

        it('should reject unauthenticated requests', async () => {
            const res = await request(app)
                .post('/api/orders')
                .send({});

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/orders/my-orders', () => {
        it('should return user orders', async () => {
            const res = await request(app)
                .get('/api/orders/my-orders')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });

        it('should not return other users orders', async () => {
            const otherUser = await request(app)
                .post('/api/users/register')
                .send({ name: 'Other', email: 'other@test.com', password: 'pass1234' });

            const res = await request(app)
                .get('/api/orders/my-orders')
                .set('Authorization', `Bearer ${otherUser.body.token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should return order by ID for owner', async () => {
            const ordersRes = await request(app)
                .get('/api/orders/my-orders')
                .set('Authorization', `Bearer ${userToken}`);

            const orderId = ordersRes.body[0]._id;

            const res = await request(app)
                .get(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(orderId);
        });

        it('should allow admin to view any order', async () => {
            const ordersRes = await request(app)
                .get('/api/orders/my-orders')
                .set('Authorization', `Bearer ${userToken}`);

            const orderId = ordersRes.body[0]._id;

            const res = await request(app)
                .get(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
        });
    });

    describe('GET /api/orders (admin)', () => {
        it('should return all orders for admin', async () => {
            const res = await request(app)
                .get('/api/orders')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        it('should reject non-admin users', async () => {
            const res = await request(app)
                .get('/api/orders')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });

    describe('PUT /api/orders/:id/deliver', () => {
        it('should mark order as delivered by admin', async () => {
            const ordersRes = await request(app)
                .get('/api/orders/my-orders')
                .set('Authorization', `Bearer ${userToken}`);

            const orderId = ordersRes.body[0]._id;

            const res = await request(app)
                .put(`/api/orders/${orderId}/deliver`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.isDelivered).toBe(true);
            expect(res.body.deliveredAt).toBeDefined();
        });
    });
});
