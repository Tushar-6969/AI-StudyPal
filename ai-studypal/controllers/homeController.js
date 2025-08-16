const Chat = require("../models/chatmodel");

exports.homeGet = async (req, res) => {
  let conversation = [];
  if (req.isAuthenticated() && req.session.chatId) {
    const chat = await Chat.findById(req.session.chatId);
    conversation = chat?.conversation || [];
  }
  res.render("home", { conversation, error: null });
};
