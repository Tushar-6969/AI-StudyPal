const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// const User = require("../models/user");
const User = require("../models/user");

// ========================
// Multer Config
// ========================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ========================
// Auth Middleware
// ========================

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized. Please login." });
}

// ========================
// GET PROFILE
// ========================

router.get("/me", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;

    res.render("profile", {
      user
    });

  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// ========================
// UPDATE PROFILE (BIO ONLY)
// ========================

// ========================
// UPDATE PROFILE (BIO)
// ========================

router.post("/update", isLoggedIn, async (req, res) => {
  try {
    const { bio } = req.body;

    await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    );

    // Redirect back to profile page after update
    res.redirect("/profile/me");

  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// ========================
// UPLOAD PROFILE IMAGE
// ========================

router.post(
  "/upload-photo",
  isLoggedIn,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profilePic: `/uploads/${req.file.filename}` },
        { new: true }
      );

     // Redirect back to profile page after update
    res.redirect("/profile/me");


    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
