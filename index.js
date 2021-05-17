require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

// Starting
const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Import Routes
const userRouter = require("./routes/User");
app.use(userRouter);
const companyRouter = require("./routes/Company");
app.use(companyRouter);

app.all("*", (req, res) =>
    res.status(404).json({ message: "route not found" })
);
app.listen(process.env.PORT, () => console.log("server Started"));
