const path = require("path");
const fs = require("fs"); // this is the file system
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

exports.updatePost = (req, res, next) => {
  const id = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 422 is the validation failed status code
    return res.status(422).json({
      message: "Validation Failed in the Server side",
      errors: errors.array(),
    });
  }
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  let imageUrl = req.body.image;
  // If the user picks a new image to upload
  if (req.file) {
    imageUrl = req.file.path;
  }
  // Here if we didn't extract the image from put body and user didn't pick any new image
  // then we need to throw an error notifying the user that nothing is picked
  if (!imageUrl) {
    const error = new Error("No Image was picked!!!");
    error.statusCode = 422;
    throw error;
  }
  // After finishing checking the image if we get rather than picking a new one or
  // from the existing one, and check the Form validation making sure the length of the text
  // is satisfied then we continue on to actually update the post on the Database.

  Post.findById(id)
    .then((post) => {
      // if no post is found we need to throw an error
      if (!post) {
        const error = new Error("No Post Was Found !!");
        error.statusCode = 404;
        throw error;
      }
      // if we reach here that means we have a post so let's update it in the database

      // First we set the new values

      // We need to check if we are uploading a new image or not
      if (imageUrl !== post.imageUrl) {
        // post.imageUrl is going to be the old image so i want to clear it
        clearImage(post.imageUrl);
      }
      post.title = updatedTitle;
      post.content = updatedContent;
      post.imageUrl = imageUrl;

      // Then we save it
      return post.save();
    })
    .then((result) => {
      // here in this then we want to check if we successfully store the post to our database
      res
        .status(200) // 200 means that the process was successful,
        // we didn't use 201 because we didn't create new post
        .json({ message: "Post Updated Successfully", post: result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        // 500 means that there is a problem with the server side
        error.statusCode = 500;
      }
    });
};

//  This method will be used to handle updating the image by clearing the old one
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => {
    console.log(error);
  });
};
