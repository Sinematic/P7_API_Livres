const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author : {type: String, required: true },
    releaseYear: {type: String, required: true },
    imageUrl: { type: String, required: true },
    genre: { type: String, required: true},
    rating: { type: String, require: false },
    price: { type: Number, required: true },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Book', bookSchema);