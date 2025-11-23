const express = require("express");

const router = express.Router();

// We can use PUT here because Put can be used to create a user once and also overwrite that user
router.put("/signup");

module.exports = router;
