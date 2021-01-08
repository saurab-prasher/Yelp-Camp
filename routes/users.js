const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

const users = require("../controllers/users");

// render register form
router.get("/register", users.renderRegister);

// handle post request and register user
router.post("/register", catchAsync(users.register));

//render login form
router.get("/login", users.renderLogin);

// login user and authenticate using passport
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

// logout user
router.get("/logout", users.logout);

module.exports = router;
