const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.replace("Bearer ", "");
            const user = await User.findOne({ token: token }).select(
                "email user company token"
            );

            if (user) {
                req.user = user;
                return next();
            } else {
                res.status(401).json({ message: "unauthorized" });
            }
        } else {
            res.status(401).json({ message: "unauthorized" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = isAuthenticated;
