const path = require("path");
const express = require("express");
const feedRoute = require("./routes/feed");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const multer = require("multer"); // This is responsible for handling image uploading
const { v4: uuidv4 } = require("uuid"); // Also this is responsible for handling image uploading

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // used for contentType: Application/JSON

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Who can access our server * means all Clients
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  ); // What HTTP methods are allowed you can choose whatever you want doesn't need to be all of them
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, connect-src"
  ); // Those headers need to be with the request by the client
  next(); // so we can go to the other middleware in line which is "app.use("/feed", feedRoute);"
});

// all the routes for feedRoute will start with /feed
app.use("/feed", feedRoute);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected");
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
