const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    scores: [{
        date: Date,
        score: Number
    }],
    lastPlayed: Date
});

module.exports = mongoose.model('User', UserSchema);
