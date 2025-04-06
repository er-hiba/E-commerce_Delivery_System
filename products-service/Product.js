const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String, 
    description: String,
    price: Number,
    stock: Number,
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Product = mongoose.model('Product', productSchema);