const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    carrier_id: String,
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Delivered'],
        default: 'Pending'
    },
    delivery_address: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Delivery = mongoose.model("Delivery", deliverySchema);