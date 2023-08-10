const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        if (extension) {
            callback(null, name + Date.now() + '.' + extension);
        } else {
            callback(new Error('Invalid file type'));
        }
    }
});

module.exports = multer({ storage }).single('image');