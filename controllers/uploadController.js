const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { uploadImage };
