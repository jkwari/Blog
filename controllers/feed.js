exports.getFeed = (req, res, next) => {
  res.status(200).json({
    title: "Something",
    author: "Jamal Eldeen Wari",
    tableOfContent: ["introduction", "Theory", "Technical", "Practical"],
  });
};
