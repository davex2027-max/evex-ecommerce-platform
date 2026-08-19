const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Ad = require('./models/Ad');
require('dotenv').config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@evex.com',
        password: 'admin123',
        role: 'admin',
    },
    {
        name: 'David Business',
        email: 'david@evexbusiness.com',
        password: 'business123',
        role: 'business_owner',
    },
];

const products = [
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship smartphone with S Pen, 200MP camera, and titanium frame. 5G enabled with 256GB storage.',
        category: 'Electronics',
        brand: 'Samsung',
        price: 1299.99,
        countInStock: 25,
        imageUrl: 'https://placehold.co/600x400?text=Samsung+Galaxy+S24',
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air unit for cushioning. Available in multiple colors.',
        category: 'Fashion',
        brand: 'Nike',
        price: 159.99,
        countInStock: 50,
        imageUrl: 'https://placehold.co/600x400?text=Nike+Air+Max+270',
        rating: 4.2,
        numReviews: 8,
    },
    {
        name: 'Dyson V15 Detect Vacuum',
        description: 'Cordless stick vacuum with laser dust detection, HEPA filtration, and 60-minute runtime.',
        category: 'Home',
        brand: 'Dyson',
        price: 749.99,
        countInStock: 15,
        imageUrl: 'https://placehold.co/600x400?text=Dyson+V15+Detect',
        rating: 4.8,
        numReviews: 20,
    },
];

const ads = [
    {
        businessName: 'Harare Digital Solutions',
        title: 'Web Design & Development Services',
        description: 'Professional website design starting from $299. We build responsive, fast, and modern websites for businesses of all sizes.',
        category: 'Technology',
        contactPhone: '+263 77 123 4567',
        imageUrl: 'https://placehold.co/600x400?text=Harare+Digital+Solutions',
    },
    {
        businessName: 'Fresh Mart Groceries',
        title: 'Weekly Fresh Produce Deals',
        description: 'Get up to 30% off on fresh fruits, vegetables, and dairy products every weekend. Free delivery on orders above $50.',
        category: 'Food & Grocery',
        contactPhone: '+263 78 987 6543',
        imageUrl: 'https://placehold.co/600x400?text=Fresh+Mart+Groceries',
    },
    {
        businessName: 'ZimFit Gym & Wellness',
        title: 'New Member Special - 50% Off First Month',
        description: 'Join Zimbabwe\'s premium fitness center. Modern equipment, certified trainers, swimming pool, and group classes.',
        category: 'Health & Fitness',
        contactPhone: '+263 71 555 1234',
        imageUrl: 'https://placehold.co/600x400?text=ZimFit+Gym',
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');

        await User.deleteMany({});
        await Product.deleteMany({});
        await Ad.deleteMany({});
        console.log('Cleared existing data');

        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            const saved = await user.save();
            createdUsers.push(saved);
        }
        console.log(`Created ${createdUsers.length} users`);

        const businessUser = createdUsers[1];

        const productsWithUser = products.map((p) => ({
            ...p,
            createdBy: businessUser._id,
        }));
        const createdProducts = await Product.insertMany(productsWithUser);
        console.log(`Created ${createdProducts.length} products`);

        const adsWithUser = ads.map((a) => ({
            ...a,
            createdBy: businessUser._id,
        }));
        const createdAds = await Ad.insertMany(adsWithUser);
        console.log(`Created ${createdAds.length} ads`);

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

seedData();
