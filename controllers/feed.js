const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getFeed = (req, res, next) => {
  Post.find()
    .then((result) => {
      res.status(200).json({
        posts: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 422 is the validation failed status code
    return res.status(422).json({
      message: "Validation Failed in the Server side",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: "Jamal Eldeen Wari",
    },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post Added Successfully !!!",
        post: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getPost = (req, res, next) => {
  // we want to extract the post ID from the url

  const postId = req.params.postId;

  // Now after getting the ID from the URL we can get the post by its ID

  Post.findById(postId)
    .then((result) => {
      res.status(200).json({
        message: `Post with ID ${postId} is found in the database`,
        post: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
