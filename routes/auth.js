const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");

const authController = require("../controllers/auth");
const router = express.Router();

// We can use PUT here because Put can be used to create a user once and also overwrite that user.
router.put(
  "/signup",
  [
    body("email")
      .isEmail() // Checking if the provided email in put body is an actual email written correctlly.
      .withMessage("Please Provide a Valid Email") // This is a message for user if written wrong.
      .custom((value, { req }) => {
        // In this custom function we want to check in the database if the provided email is in the database or not.
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            //Checks the database to see if the provided email already exists. If it exists, reject validation by returning a rejected Promise.
            return Promise.reject("This Email Already Exists!!!");
          }
        });
      })
      .normalizeEmail(), // Converts the email to normalized form by removing extra dots, converting domain to lowercase, and fixing common formating issues.
    //  so all emails have the same format when they are stored in the database.

    body("password").trim().isLength({ min: 8 }), // trim(): does remove any white spaces
    body("name").trim().not().isEmpty(), // not().isEmpty(): Makes sure this field is not empty and the validation will fail if it is
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
