const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./app');
require('dotenv').config();

const start = async () => {
    await connectDB();

    if (process.env.AUTO_SEED === 'true') {
        const { seedIfEmpty } = require('./seed/seedData');
        await seedIfEmpty();
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
