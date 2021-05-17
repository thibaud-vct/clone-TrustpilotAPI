const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
    company: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    score: Number,
    review: String,
    reviewDate: Date,
    answer: String,
    answerDate: Date,
});
module.exports = Review;
