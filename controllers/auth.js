const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

require("dotenv").config();

const bcrypt = require("bcrypt");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  // Here if the validation is successfull then we extract the fields from body and
  // store it in the database.

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  // We need to hash the paasword before storing it in the database
  bcrypt
    .hash(password, 12)
    .then((hasedPass) => {
      const addUser = new User({
        email: email,
        password: hasedPass,
        name: name,
      });
      return addUser.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "User Added Successfully", post: result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
    });
};

exports.login = (req, res, next) => {
  // Extract the email and password from the body
  const email = req.body.email;
  const password = req.body.password;

  // Check if that email we extracted is in the database

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User does not Exist");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      // if the user is found then we need to check if the extracted password matches the one in the database
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password does not match");
        error.statusCode = 401;
        throw error;
      }
      // Set up JWT next.....
      // Here we store some information regarding the user but not password,
      // because it can be decoded and the information will be exposed
      const payload = {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      };
      //  jwt.sign here we are creating the signature using payload, and the secret
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h", // We don't want the token always available for security purposes after one hour the token will be expired
      });
      // This response will be sent to frontend and the token will be stored in a local storage,
      // to make sure any action the user does from now on he/she must be authenticated
      res.status(200).json({
        message: "The user is autheticated using JWT",
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
