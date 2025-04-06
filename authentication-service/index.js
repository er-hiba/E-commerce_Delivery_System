require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 4003;
const mongoose = require("mongoose");
const User = require("./Authentication");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("./isAuthenticated")

app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
    .connect("mongodb://127.0.0.1/authentication-service")
    .then(() => {
        console.log("Authentication-service DB Connected");
    })
    .catch((error) => console.log(error));


app.post("/auth/register", async (req, res) => {
    let { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.json({ message: "User already exists" });
    } else {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                });
            } else {
                password = hash;
                const newUser = new User({
                    name, email, password
                });
                newUser.save()
                    .then(user => res.status(201).json(user))
                    .catch(error => res.status(400).json({ error }));
            }
        });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    } else {
        bcrypt.compare(password, user.password)
            .then(response => {
                if (!response) {
                    return res.json({ message: "Incorrect password" });
                } else {
                    const payload = {
                        userId: user._id,
                        email: user.email,
                        name: user.name
                    };
                    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
                        if (err) {
                            console.log(err);
                        } else {
                            return res.json({ token: token });
                        };
                    });
                }
            });
    }
});

app.get('/auth/profile', isAuthenticated, (req, res) => {
    res.status(200).json(req.user);
});

app.listen(PORT, () => {
    console.log(`Authentication-Service at ${PORT}`);
});