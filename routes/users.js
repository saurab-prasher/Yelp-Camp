const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.post("/changepassword", function (req, res) {
  User.findOne({ _id: "your id here" }, (err, user) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: "User not found" }); // Return error, user was not found in db
      } else {
        user.changePassword(
          req.body.oldpassword,
          req.body.newpassword,
          function (err) {
            if (err) {
              if (err.name === "IncorrectPasswordError") {
                res.json({ success: false, message: "Incorrect password" }); // Return error
              } else {
                res.json({
                  success: false,
                  message:
                    "Something went wrong!! Please try again after sometimes.",
                });
              }
            } else {
              res.json({
                success: true,
                message: "Your password has been changed successfully",
              });
            }
          }
        );
      }
    }
  });
});

// logout user
router.get("/logout", users.logout);

module.exports = router;
