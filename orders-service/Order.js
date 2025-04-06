const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    products: [
        {
          product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
          quantity: { type: Number, required: true, min: 1 }
        }
    ],
    customer_id: String,
    total_price: Number,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped'],
        default: 'Pending'
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Order = mongoose.model("Order", orderSchema);