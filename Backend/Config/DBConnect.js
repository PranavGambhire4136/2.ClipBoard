const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log("DB connection issue");
        console.log(err);
    });
}
