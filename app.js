require('dotenv').config();
const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const adRoutes = require('./routes/adRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { stripeWebhook } = require('./controllers/paymentController');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { securityMiddleware } = require('./middleware/securityMiddleware');

const app = express();

securityMiddleware(app);

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json({ limit: '10kb' }));

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.trim())) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 600,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('EVEX E-Commerce Platform is live!');
});

app.use('/api/products', productRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
    });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
