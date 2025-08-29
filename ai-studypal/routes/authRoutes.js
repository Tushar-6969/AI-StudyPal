const express = require("express");
const passport = require("passport");
const Chat = require("../models/chatmodel");
const authController = require("../controllers/authController");
const router = express.Router();

// Local signup & login
router.get("/signup", authController.signupGet);
router.post("/signup", authController.signupPost);
router.get("/login", authController.loginGet);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.",
  }),
  async (req, res) => {
    try {
      let existingChat = await Chat.findOne({ user: req.user._id }).sort({
        createdAt: -1,
      });
      if (!existingChat) {
        existingChat = await Chat.create({ user: req.user._id });
      }
      req.session.chatId = existingChat._id;

      req.flash("success", "Logged in successfully!");
      res.redirect("/");
    } catch (err) {
      console.error("Local login error:", err);
      req.flash("error", "Something went wrong during login.");
      res.redirect("/login");
    }
  }
);

// Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: "Google login failed.",
  }),
  async (req, res) => {
    try {
      let existingChat = await Chat.findOne({ user: req.user._id }).sort({
        createdAt: -1,
      });
      if (!existingChat) {
        existingChat = await Chat.create({ user: req.user._id });
      }
      req.session.chatId = existingChat._id;

      req.flash("success", "Logged in with Google successfully!");
      res.redirect("/");
    } catch (err) {
      console.error("Google login error:", err);
      req.flash("error", "Something went wrong with Google login.");
      res.redirect("/login");
    }
  }
);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
