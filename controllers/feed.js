const path = require("path");
const fs = require("fs"); // this is the file system
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.getFeed = (req, res, next) => {
  // This currentPage Var is getting the page count from the frontend because i am passing it
  // as a query parameter. And this || 1 it check if req.query.page if it is null then set it
  // by default to 1 not null
  const currentPage = req.query.page || 1;

  // Number of posts per page we set it to two to align with the frontend
  const perPage = 2;
  // This variable will keep count of the number of posts in the database
  let totalItems;

  const userId = req.userId;

  Post.countDocuments({ "creator._id": userId })
    .then((count) => {
      // After running countDocuments() we will have the number of posts in the Database
      totalItems = count;

      return (
        Post.find({ "creator._id": userId })
          // Here is the pagination logic
          .skip((currentPage - 1) * perPage)
          .limit(perPage)
      );
    })
    .then((posts) => {
      res.status(200).json({
        posts: posts,
        totalItems: totalItems,
      });
    })

    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
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
  // Let's retreive the User ID from the request we did in isAuth File

  const userId = req.userId;
  let creator;
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  console.log(req.name);

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      _id: userId,
      name: req.name,
    },
  });
  post
    .save()
    .then(() => {
      // Once we saved the post we need to find the user we want to save the post to
      return User.findById(userId);
    })
    .then((user) => {
      // User model does have "posts" property we want to store our new post to that posts array
      user.posts.push(post);
      creator = user;
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post added successfully by " + creator.name,
        post: post,
        creator: {
          _id: creator._id,
          email: creator.email,
        },
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

exports.deletePost = (req, res, next) => {
  id = req.params.postId;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error("No Post is found");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(id);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(id);
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted Successfully" });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
    });
};

exports.getStatus = (req, res, next) => {
  // We need to fetch the user status from the database

  User.findById({ _id: req.userId })
    .then((user) => {
      const status = user.status;
      res.status(200).json({
        message: "Status fetched from DB",
        status: status,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
    });
};

exports.updateStatus = (req, res, next) => {
  // We need to get the new status from the update body
  console.log(req.body.status);

  const newStatus = req.body.status;
  const userId = req.userId;
  User.findById({ _id: userId })
    .then((user) => {
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status.json({
        message: "Status Updated",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
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
