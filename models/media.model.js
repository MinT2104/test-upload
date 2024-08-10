const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    uploadId: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    categories: [String]
});

module.exports = mongoose.model('media', mediaSchema);
