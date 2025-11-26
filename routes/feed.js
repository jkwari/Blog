const express = require("express");

const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

const feedController = require("../controllers/feed");

// GET: /feed/posts
router.get("/posts", isAuth, feedController.getFeed);

// POST: /feed/addPost
router.post(
  "/addPost",
  isAuth,
  [
    // Here we want to validate both title and content from the server side and the validation
    // must match the client side in terms of length which is 5 for both frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);
/** IMPORTANT TO KNOW */
// here we can use put we never used it before because normal browser forms doesn't support it
// but when we are using asynchronous requests triggering by JS yes we can use (Put, Patch)
router.put(
  "/updatePost/:postId",
  isAuth,
  [
    // Here we want to validate both title and content from the server side and the validation
    // must match the client side in terms of length which is 5 for both frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/deletePost/:postId", isAuth, feedController.deletePost);

router.get("/getStatus", isAuth, feedController.getStatus);

router.put("/updateStatus", isAuth, feedController.updateStatus);
module.exports = router;
