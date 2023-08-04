const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true},
    mail: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', UserSchema);