const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  prompt: String,
  response: String,
});

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Chat",
  },
  conversation: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Chat", chatSchema);
