require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 4002;
const mongoose = require("mongoose");
const Delivery = require("./Delivery");
const axios = require("axios");
const isAuthenticated = require("./isAuthenticated");

app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
    .connect("mongodb://127.0.0.1/delivery-service")
    .then(() => {
        console.log("Delivery-service DB Connected");
    })
    .catch((error) => console.log(error));


app.post("/delivery/add", isAuthenticated, async (req, res) => {
    const { order_id, carrier_id, delivery_address } = req.body;
    const token = req.token;
    try {
        const response = await axios.get(`http://localhost:4001/order/${order_id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const order = response.data;
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        const newDelivery = new Delivery({
            order_id,
            carrier_id,
            delivery_address
        });

        const savedDelivery = await newDelivery.save();
        res.status(201).json(savedDelivery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/delivery/:id", isAuthenticated, async (req, res) => {
    const deliveryId = req.params.id;
    const status = req.body.status;
    const token = req.token;

    if (!["Pending", "In Progress", "Delivered"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value." });
    }

    Delivery.findById(deliveryId)
        .then((delivery) => {
            if (!delivery) {
                return res.status(404).json({ message: "Delivery not found" });
            }
            delivery.status = status;
            return delivery.save();
        })
        .then((updatedDelivery) => {
            if (status === 'Delivered') {
                return axios.patch(`http://localhost:4001/order/${updatedDelivery.order_id}/status`, {
                    status: 'Shipped'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(() => updatedDelivery); 
            } else {
                return updatedDelivery;
            }
        })
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

app.listen(PORT, () => {
    console.log(`Delivery-Service running at port ${PORT}`);
});