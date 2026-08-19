const mongoose = require('mongoose');
const app = require('../app');

const TEST_DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/evex_test_db';

const connect = async () => {
    await mongoose.connect(TEST_DB_URI);
};

const close = async () => {
    await mongoose.disconnect();
};

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

module.exports = { app, connect, close, clearDatabase };
