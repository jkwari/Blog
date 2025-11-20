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
  // const imageUrl = req.body.imageUrl;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/rdr2.jpg",
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
