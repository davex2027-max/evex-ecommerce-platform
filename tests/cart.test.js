const request = require('supertest');
const { app, connect, close, clearDatabase } = require('./setup');

let userToken;
let productId;

beforeAll(async () => {
    await connect();

    const userRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Cart User', email: 'cart@test.com', password: 'pass1234' });
    userToken = userRes.body.token;

    const bizRes = await request(app)
        .post('/api/users/register')
        .send({ name: 'Biz User', email: 'bizcart@test.com', password: 'pass1234', role: 'business_owner' });

    const productRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${bizRes.body.token}`)
        .send({
            name: 'Cart Product',
            description: 'For cart testing',
            category: 'Test',
            brand: 'Test',
            price: 50.00,
            countInStock: 5,
            imageUrl: 'https://example.com/img.jpg',
        });
    productId = productRes.body._id;
});

afterAll(async () => {
    await clearDatabase();
    await close();
});

describe('Cart Endpoints', () => {
    describe('GET /api/cart', () => {
        it('should return empty cart for new user', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toEqual([]);
            expect(res.body.totalPrice).toBe(0);
        });

        it('should reject unauthenticated requests', async () => {
            const res = await request(app).get('/api/cart');
            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/cart/add', () => {
        it('should add item to cart', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ productId, quantity: 2 });

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(1);
            expect(res.body.items[0].quantity).toBe(2);
            expect(res.body.items[0].price).toBe(50.00);
            expect(res.body.totalPrice).toBe(100.00);
        });

        it('should increase qty if item already in cart', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ productId, quantity: 2 });

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(1);
            expect(res.body.items[0].quantity).toBe(4);
            expect(res.body.totalPrice).toBe(200.00);
        });

        it('should add item with quantity exceeding stock (no server-side check)', async () => {
            await request(app)
                .delete('/api/cart')
                .set('Authorization', `Bearer ${userToken}`);

            const res = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ productId, quantity: 100 });

            expect(res.status).toBe(200);
            expect(res.body.items[0].quantity).toBe(100);
        });
    });

    describe('PUT /api/cart/:id', () => {
        it('should update item quantity', async () => {
            const addRes = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${userToken}`);

            const itemId = addRes.body.items[0].product._id;

            const res = await request(app)
                .put(`/api/cart/${itemId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 3 });

            expect(res.status).toBe(200);
            expect(res.body.items[0].quantity).toBe(3);
            expect(res.body.totalPrice).toBe(150.00);
        });
    });

    describe('DELETE /api/cart/:id', () => {
        it('should remove item from cart', async () => {
            const res = await request(app)
                .delete(`/api/cart/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(0);
            expect(res.body.totalPrice).toBe(0);
        });
    });
});
