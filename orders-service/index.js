require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 4001;
const mongoose = require("mongoose");
const Order = require("./Order");
const axios = require("axios");
const isAuthenticated = require("./isAuthenticated");

app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1/orders-service")
  .then(() => {
    console.log("Orders-service DB Connected");
  })
  .catch((error) => console.log(error));


async function httpRequest(products, token) {
  try {
    let total = 0;

    for (const item of products) {
      const response = await axios.get(`http://localhost:4000/product/${item.product_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const product = response.data;

      if (!product || product.stock < item.quantity) {
        console.error(`Not enough stock for product ${item.product_id}`);
        return null;
      }

      total += product.price * item.quantity;
    }

    return total;
  } catch (error) {
    console.error("Error in httpRequest:", error.message);
    return null;
  }
}

app.post("/order/add", isAuthenticated, async (req, res) => {
  const products = req.body.products;
  const customer_id = req.user.userId;
  const token = req.token;
  try {
    const total = await httpRequest(products, token);

    if (total === null) {
      return res.status(400).json({ message: "Invalid products or not enough stock." });
    }

    const newOrder = new Order({
      products,
      customer_id,
      total_price: total
    });

    const savedOrder = await newOrder.save();

    for (const item of products) {
      await axios.patch(`http://localhost:4000/product/${item.product_id}/stock`,
        { quantity: item.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/order/:id", isAuthenticated, (req, res) => {
  const id = req.params.id;
  Order.findById(id)
    .then((order) => res.status(200).json(order))
    .catch((error) => res.status(500).json({ error: error.message }));
});

app.patch("/order/:id/status", isAuthenticated, (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  if (!['Pending', 'Confirmed', 'Shipped'].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  Order.findById(id)
    .then((order) => {
      order.status = status;
      return order.save();
    })
    .then((updatedOrder) => {
      res.status(200).json(updatedOrder);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(PORT, () => {
  console.log(`Orders-Service at ${PORT}`);
});