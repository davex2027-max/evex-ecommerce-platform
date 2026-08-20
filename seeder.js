const mongoose = require('mongoose');
const { forceSeed } = require('./seed/seedData');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');

        await forceSeed();

        console.log('\n--- Seed Complete ---');
        console.log('Admin:       admin@evex.com / admin123');
        console.log('Business:    david@evexbusiness.com / business123');
        console.log('---------------------');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

run();