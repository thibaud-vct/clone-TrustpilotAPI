const mongoose = require("mongoose");

const user = mongoose.model("user", {
    email: { unique: true, type: String },
    user: {
        firstName: String,
        lastName: String,
        avatarImageURL: String,
        reviews: [mongoose.Schema.Types.ObjectId],
    },
    company: mongoose.Schema.Types.ObjectId,
    token: String,
    hash: String,
    salt: String,
});

module.exports = user;
