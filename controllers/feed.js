exports.getFeed = (req, res, next) => {
  res.status(200).json({
    title: "Something",
    author: "Jamal Eldeen Wari",
    tableOfContent: ["introduction", "Theory", "Technical", "Practical"],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;

  res.status(201).json({
    message: "Post Added Successfully !!!",
    post: {
      id: new Date().toISOString(),
      title: title,
      author: author,
    },
  });
};
