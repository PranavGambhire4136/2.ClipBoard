const express = require('express');
require('dotenv').config();
const app = express();
const blog = require("./Routes/Blog");
const Cloudinary = require("./Config/Cloudinary");
const DBConnect = require("./Config/DBConnect");
const fileUpload = require("express-fileupload");
const cors = require("cors");

Cloudinary.cloudinaryConnect();
DBConnect.connectDB();

app.use(cors('https://2-clip-board-977r.vercel.app'));

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is running"
    });
})

app.use("/api/v1", blog);

app.listen(process.env.PORT, () => {
    console.log("shree Ganeshaya namah");
});
