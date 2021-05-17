const mongoose = require("mongoose");

const Company = mongoose.model("Company", {
    website: { unique: true, type: String },
    name: String,
    logoImageURL: String,
    description: String,
    score: Number,
    reviews: [mongoose.Schema.Types.ObjectId],
});
module.exports = Company;
