const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true},
    mail: { type: String, required: true},
    signedUp: {type: Date, required: false}
});

module.exports = mongoose.model('User', UserSchema);