const User = require("../models/user");

exports.signupGet = (req, res) => {
  res.render("signup");
};

exports.signupPost = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username });
    await User.register(newUser, password);
    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", "Registration error. Username might already exist.");
    res.redirect("/signup");
  }
};

exports.loginGet = (req, res) => {
  res.render("login");
};

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.chatId = null;
    req.flash("success", "You have logged out successfully.");
    res.redirect("/");
  });
};
