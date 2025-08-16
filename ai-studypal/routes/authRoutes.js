const express = require("express");
const passport = require("passport");
const Chat = require("../models/chatmodel");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/signup", authController.signupGet);
router.post("/signup", authController.signupPost);
router.get("/login", authController.loginGet);

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Invalid username or password."
}), async (req, res, next) => {
  try {
    const existingChat = await Chat.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (existingChat) {
      req.session.chatId = existingChat._id;
    } else {
      const newChat = await Chat.create({ user: req.user._id });
      req.session.chatId = newChat._id;
    }
    req.flash("success", "Logged in successfully!");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Something went wrong during login.");
    res.redirect("/login");
  }
});

router.get("/logout", authController.logout);

module.exports = router;
