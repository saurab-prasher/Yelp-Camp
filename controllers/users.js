const User = require("../models/user");

// render register form
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// handle post request and register user
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

//render login form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// login user
module.exports.login = async (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// logout user
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "GoodBye!");
  res.redirect("/campgrounds");
};
