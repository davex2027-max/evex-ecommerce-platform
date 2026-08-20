const User = require('../models/User');
const Product = require('../models/Product');
const Ad = require('../models/Ad');

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
        price: 1850000,
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
        price: 85000,
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
        price: 1200000,
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
        description: "Join Zimbabwe's premium fitness center. Modern equipment, certified trainers, swimming pool, and group classes.",
        category: 'Health & Fitness',
        contactPhone: '+263 71 555 1234',
        imageUrl: 'https://placehold.co/600x400?text=ZimFit+Gym',
    },
];

const createSeedData = async () => {
    const createdUsers = [];
    for (const userData of users) {
        const user = new User(userData);
        const saved = await user.save();
        createdUsers.push(saved);
    }

    const businessUser = createdUsers[1];

    const productsWithUser = products.map((p) => ({
        ...p,
        createdBy: businessUser._id,
    }));
    await Product.insertMany(productsWithUser);

    const adsWithUser = ads.map((a) => ({
        ...a,
        createdBy: businessUser._id,
    }));
    await Ad.insertMany(adsWithUser);

    return createdUsers;
};

// Seeds only when the database is empty. Safe to run on every startup —
// it skips as soon as any data exists.
const seedIfEmpty = async () => {
    const [userCount, productCount] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
    ]);

    if (userCount > 0 || productCount > 0) {
        console.log('Database already has data — skipping auto-seed.');
        return false;
    }

    const createdUsers = await createSeedData();
    console.log(`Auto-seeded ${createdUsers.length} users, ${products.length} products, ${ads.length} ads.`);
    return true;
};

// Destructive: wipes collections then re-inserts. Used by `npm run seed`.
const forceSeed = async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Ad.deleteMany({});
    console.log('Cleared existing data');

    const createdUsers = await createSeedData();
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${products.length} products`);
    console.log(`Created ${ads.length} ads`);
    return createdUsers;
};

module.exports = { seedIfEmpty, forceSeed, users, products, ads };