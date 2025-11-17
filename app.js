const express = require("express");
const feedRoute = require("./routes/feed");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // used for contentType: Application/JSON

// all the routes for feedRoute will start with /feed
app.use("/feed", feedRoute);

app.listen(8080);
