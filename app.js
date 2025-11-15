const express = require("express");
const feedRoute = require("./routes/feed");

const app = express();

// all the routes for feedRoute will start with /feed
app.use("/feed", feedRoute);

app.listen(8080);
