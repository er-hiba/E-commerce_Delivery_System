require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const Product = require("./Product");
const isAuthenticated = require("./isAuthenticated");

app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
    .connect("mongodb://127.0.0.1/products-service")
    .then(() => {
        console.log("Products-service DB Connected");
    })
    .catch((error) => console.log(error));

app.post("/product/add", isAuthenticated, (req, res) => {
    const { name, description, price, stock } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
        stock
    });
    newProduct
        .save()
        .then((product) => res.status(201).json(product))
        .catch((error) => res.status(500).json({ error: error.message }));
});

app.get("/product/:id", isAuthenticated, (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then((product) => res.status(200).json(product))
        .catch((error) => res.status(500).json({ error: error.message }));
});

app.patch("/product/:id/stock", isAuthenticated, (req, res) => {
    const id = req.params.id;
    const quantity = req.body.quantity;

    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ message: "Not enough stock available." });
            }
            product.stock -= quantity;
            return product.save();
        })
        .then((updatedProduct) => {
            res.status(200).json(updatedProduct);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});


app.listen(PORT, () => {
    console.log(`Products-Service at ${PORT}`);
});