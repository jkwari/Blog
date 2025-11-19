const { validationResult } = require("express-validator");

exports.getFeed = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post",
        imageUrl: "images\rdr2.jpg",
        creator: {
          name: "Jamal Eldeen Wari",
        },
        createdAt: new Date(),
      },
    ],
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

  res.status(201).json({
    message: "Post Added Successfully !!!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "Jamal Eldeen Wari", // this will be dynamic later not like this static
      },
      createdAt: new Date(),
    },
  });
};
