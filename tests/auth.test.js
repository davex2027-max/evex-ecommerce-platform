const request = require('supertest');
const { app, connect, close, clearDatabase } = require('./setup');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await close());

describe('Auth Endpoints', () => {
    describe('POST /api/users/register', () => {
        it('should register a new user and return token', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'John Doe',
                    email: 'john@test.com',
                    password: 'password123',
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.name).toBe('John Doe');
            expect(res.body.email).toBe('john@test.com');
            expect(res.body.role).toBe('user');
            expect(res.body).toHaveProperty('_id');
            expect(res.body).not.toHaveProperty('password');
        });

        it('should register a business_owner user', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Business Owner',
                    email: 'biz@test.com',
                    password: 'password123',
                    role: 'business_owner',
                });

            expect(res.status).toBe(201);
            expect(res.body.role).toBe('business_owner');
        });

        it('should reject duplicate email', async () => {
            await request(app)
                .post('/api/users/register')
                .send({ name: 'User 1', email: 'dup@test.com', password: 'pass1234' });

            const res = await request(app)
                .post('/api/users/register')
                .send({ name: 'User 2', email: 'dup@test.com', password: 'pass5678' });

            expect(res.status).toBe(400);
        });

        it('should reject missing fields', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({ name: 'No Email' });

            expect(res.status).toBe(400);
        });

        it('should reject short password', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({ name: 'Short', email: 'short@test.com', password: '12' });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/users/register')
                .send({ name: 'Login User', email: 'login@test.com', password: 'password123' });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'login@test.com', password: 'password123' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.name).toBe('Login User');
            expect(res.body.email).toBe('login@test.com');
        });

        it('should reject wrong password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'login@test.com', password: 'wrongpassword' });

            expect(res.status).toBe(401);
        });

        it('should reject non-existent email', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'nobody@test.com', password: 'password123' });

            expect(res.status).toBe(401);
        });

        it('should reject empty fields', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({});

            expect(res.status).toBe(400);
        });
    });
});
