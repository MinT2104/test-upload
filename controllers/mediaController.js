const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const media = require('../models/media.model');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mediaController = {
    uploadFiles: (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(500).json({ error: 'File upload failed' });
            }

            const file = files.file[0]; // `files.file` matches the name of the form field in your client

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Extract title and description from the form fields
            const title = fields.title || 'Untitled';
            const description = fields.description || 'No description';

            try {
                // Upload file to Cloudinary
                const result = await cloudinary.uploader.upload(file.filepath, {
                    resource_type: 'auto', // Auto-detects the file type
                    folder: 'uploads', // Optional: organize files in a folder
                });

                // Remove the local file
                fs.unlinkSync(file.filepath);

                // Save media metadata to the database
                const newMedia = new media({
                    uploadId: result.public_id,
                    url: result.secure_url,
                    title: title[0],
                    description: description[0],
                    userId: '123456'
                });

                await newMedia.save();

                // Respond with Cloudinary URL and public ID
                res.status(200).json({
                    url: result.secure_url,
                    publicId: result.public_id,
                    title: title[0],
                    description: description[0],
                });
            } catch (err) {
                console.error('Error uploading to Cloudinary:', err);
                res.status(500).json({ error: 'File upload to Cloudinary failed' });
            }
        });
    },

    getFiles: async (req, res) => {
        try {
            const { query } = req.body;
            
            const result = await media.find(query)
            
            return res.status(200).json(result)

        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch file metadata' });
        }
    }
}

module.exports = mediaController;
