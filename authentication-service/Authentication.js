const mongoose = require('mongoose');

const authenticationSchema = mongoose.Schema({
    name: String, 
    email: {
        type: String,
        unique: true,
    },
    password: String,
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Authentication = mongoose.model('Authentication', authenticationSchema);