const express = require("express");

const { body } = require("express-validator");

const router = express.Router();

const feedController = require("../controllers/feed");

// GET: /feed/posts
router.get("/posts", feedController.getFeed);

// POST: /feed/addPost
router.post(
  "/addPost",
  [
    // Here we want to validate both title and content from the server side and the validation
    // must match the client side in terms of length which is 5 for both frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

module.exports = router;
