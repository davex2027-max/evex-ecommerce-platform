const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const hpp = require('hpp');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many auth attempts, please try again later.' },
});

const securityMiddleware = (app) => {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'"],
            },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));

    app.use(globalLimiter);

    app.use((req, res, next) => {
        if (req.body) req.body = mongoSanitize(req.body);
        if (req.params) req.params = mongoSanitize(req.params);
        if (req.query) req.query = mongoSanitize(req.query);
        next();
    });

    app.use(hpp());
};

module.exports = { securityMiddleware, authLimiter };
