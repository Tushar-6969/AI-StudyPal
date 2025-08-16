const express = require("express");
const multer = require("multer");
const chatController = require("../controllers/chatController");
const router = express.Router();

// Ensure you have authentication middleware available
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be logged in first!");
  res.redirect("/login");
}

const upload = multer({ dest: "uploads/" });

router.post("/", isLoggedIn, upload.fields([{ name: "pdf" }, { name: "image" }]), chatController.uploadPost);
router.get("/new-chat", isLoggedIn, chatController.newChatGet);
router.get("/previous-chats", isLoggedIn, chatController.previousChatsGet);
router.get("/chat/:id", isLoggedIn, chatController.chatDetailGet);

module.exports = router;
