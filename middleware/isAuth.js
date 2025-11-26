const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // First we need to check if we got the header before spliting it
  const authHeader = req.get("Authorization");
  // console.log(authHeader);

  if (!authHeader) {
    const error = new Error("Not Authenticated !!!");
    error.statusCode = 401;
    throw error;
  }
  // With req.get(key)=> here we can get the headers we applied in the frontend,
  // in our case it is Authorization
  const token = authHeader.split(" ")[1]; // in our Authorization header we have value "Bearer token" we want to remove the white space using split and get our token which is the second index

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  // if decoded is done and stored null for whatever reason we need to throw an error
  if (!decodedToken) {
    const error = new Error("Did not Authenticated");
    error.statusCode = 401;
  }
  // If token is decoded successfully then we want to extract the userId from it and store it in the request
  req.userId = decodedToken.userId;
  req.name = decodedToken.name;
  next();
};
