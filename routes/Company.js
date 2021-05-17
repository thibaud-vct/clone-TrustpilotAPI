const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

// import models
const User = require("../models/User");
const Company = require("../models/Company");
const Review = require("../models/Review");

router.get("/companies", async (req, res) => {
    try {
        const allCompany = await Company.find();
        res.status(200).json({ data: allCompany });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/company/create", async (req, res) => {
    try {
        if (req.fields.email && req.fields.companyName && req.fields.website) {
            // find already
            const company = await Company.findOne({
                website: req.fields.website,
            });
            const userManager = await User.findOne({
                email: req.fields.email,
            });
            // email pro valid
            const validEmail = req.fields.email.split("@");

            if (!company && req.fields.website === validEmail[1]) {
                // edit new company
                const newCompany = new Company({
                    website: req.fields.website,
                    name: req.fields.companyName,
                    logoImageURL: "url à remplir",
                    description: req.fields.description,
                });

                await newCompany.save();

                // assiciate user manager
                if (!userManager) {
                    const newUser = await new User({
                        email: req.fields.email,
                        company: newCompany._id,
                    });
                    await newUser.save();
                } else {
                    userManager.company = newCompany._id;
                    await userManager.save();
                }

                //response
                res.status(200).json(newCompany);
            } else {
                res.status(400).json({ message: "email invalid" });
            }
        } else {
            res.status(400).json({ message: "missing field" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/company/review", isAuthenticated, async (req, res) => {
    try {
        // find company
        const company = await Company.findOne({ _id: req.fields.companyId });
        // add review
        const newReview = await new Review({
            company: company._id,
            user: req.user._id,
            score: req.fields.score,
            review: req.fields.review,
            reviewDate: Date.now(),
        });
        await newReview.save();
        company.reviews.push(newReview._id);
        await company.save();
        req.user.user.reviews.push(newReview._id);
        await req.user.save();
        // response
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
