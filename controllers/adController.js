const Ad = require('../models/Ad');

const getAds = async (req, res) => {
    try {
        const ads = await Ad.find({});
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createAd = async (req, res) => {
    try {
        const { businessName, title, description, category, contactPhone, imageUrl } = req.body;

        const ad = new Ad({
            createdBy: req.user._id,
            businessName,
            title,
            description,
            category,
            contactPhone,
            imageUrl,
        });

        const createdAd = await ad.save();
        res.status(201).json(createdAd);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getMyAds = async (req, res) => {
    try {
        const ads = await Ad.find({ createdBy: req.user._id });
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }
        res.json(ad);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateAd = async (req, res) => {
    try {
        const { businessName, title, description, category, contactPhone, imageUrl } = req.body;

        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        if (ad.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this ad" });
        }

        ad.businessName = businessName || ad.businessName;
        ad.title = title || ad.title;
        ad.description = description || ad.description;
        ad.category = category || ad.category;
        ad.contactPhone = contactPhone || ad.contactPhone;
        ad.imageUrl = imageUrl || ad.imageUrl;

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        if (ad.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this ad" });
        }

        await Ad.deleteOne({ _id: ad._id });
        res.json({ message: "Ad removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAds, createAd, getMyAds, getAdById, updateAd, deleteAd };
