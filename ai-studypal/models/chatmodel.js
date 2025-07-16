const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  prompt: String,
  response: String,
});

const chatSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Chat" },
  conversation: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // User reference added
});

module.exports = mongoose.model("Chat", chatSchema);
