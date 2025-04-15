const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    currentPassword: {
        type: String,
        default: ''
    },
    newPassword: {
        type: String,
        default: ''
    },
    confirmPassword: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('profile', ProfileSchema);
