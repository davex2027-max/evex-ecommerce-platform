const mongoose = require('mongoose');

const adSchema = mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        contactPhone: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
