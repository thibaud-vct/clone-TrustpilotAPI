const express = require("express");
const router = express.Router();

// middleware encoding
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// import models
const User = require("../models/User");
const Company = require("../models/Company");
const Review = require("../models/Review");

router.post("/user/signup", async (req, res) => {
    try {
        if (req.fields.email && req.fields.password && req.fields.firstName) {
            // find already
            const user = await User.findOne({ email: req.fields.email });

            // create hash and token
            const newAuthentication = (password) => {
                const salt = uid2(64);
                const hash = SHA256(password + salt).toString(encBase64);
                const token = uid2(64);
                return { salt: salt, hash: hash, token: token };
            };

            if (!user) {
                const { salt, hash, token } = newAuthentication(
                    req.fields.password
                );
                // create new user
                const newUser = await new User({
                    email: req.fields.email,
                    user: {
                        firstName: req.fields.firstName,
                        lastName: req.fields.lastName,
                        avatarImageURL: "url à remplir",
                    },
                    salt: salt,
                    hash: hash,
                    token: token,
                });

                await newUser.save();

                // response
                res.status(200).json({
                    id: newUser._id,
                    email: newUser.email,
                    user: newUser.user,
                    token: newUser.token,
                });
            } else if (user && !user.token) {
                const { salt, hash, token } = newAuthentication(
                    req.fields.password
                );

                // edit user manage login
                user.user = {
                    firstName: req.fields.firstName,
                    lastName: req.fields.lastName,
                    avatarImageURL: "url à remplir",
                };
                user.salt = salt;
                user.hash = hash;
                user.token = token;

                await user.save();
                // response
                res.status(200).json({
                    id: user._id,
                    email: user.email,
                    user: user.user,
                    token: user.token,
                });
            } else {
                res.status(400).json({ message: "used by an account" });
            }
        } else {
            res.status(400).json({ message: "missing field" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/user/login", async (req, res) => {
    try {
        if (req.fields.email && req.fields.password) {
            // find if already
            const user = await User.findOne({ email: req.fields.email });

            if (user) {
                // rebuid hash
                const hash = SHA256(req.fields.password + user.salt).toString(
                    encBase64
                );
                // check and response
                if (hash === user.hash) {
                    res.status(200).json({
                        id: user._id,
                        email: user.email,
                        user: user.user,
                        token: user.token,
                    });
                } else {
                    res.status(400).json({ message: "login invalid" });
                }
            } else {
                res.status(400).json({ message: "login invalid" });
            }
        } else {
            res.status(400).json({ message: "login invalid" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
