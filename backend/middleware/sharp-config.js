const sharp = require('sharp');
const fs = require('fs').promises;

module.exports = async (req, res, next) => {
    
    try {
        const imagePath = `images/${req.file.filename}`;

        await sharp(imagePath)
            .resize(480)
            .jpeg({ quality: 80 })
            .toFile(`images/${"opt" + req.file.filename}`)
    
        await fs.unlink(imagePath, (error) => {
            if (error) return res.status(400).json({ error });
        });
    
        next();
    } catch(error) {
        return res.status(500).json({ error })
    }
}