const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword
            ? {
                  name: { $regex: req.query.keyword, $options: 'i' },
              }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const count = await Product.countDocuments({ ...keyword, ...category });
        const products = await Product.find({ ...keyword, ...category })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort(req.query.sort || '-createdAt');

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, category, brand, price, countInStock, imageUrl } = req.body;

        const product = new Product({
            createdBy: req.user._id,
            name,
            description,
            category,
            brand,
            price,
            countInStock,
            imageUrl,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, category, brand, price, countInStock, imageUrl } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.price = price !== undefined ? price : product.price;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.imageUrl = imageUrl || product.imageUrl;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await Product.deleteOne({ _id: product._id });
        res.json({ message: "Product removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        product.reviews.push({
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        });

        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
