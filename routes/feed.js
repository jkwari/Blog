const express = require("express");

const router = express.Router();

const feedController = require("../controllers/feed");

// GET: /feed/posts
router.get("/posts", feedController.getFeed);

// POST: /feed/addPost
router.post("/addPost", feedController.createPost);

module.exports = router;
