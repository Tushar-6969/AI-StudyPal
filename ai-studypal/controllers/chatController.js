const Chat = require("../models/chatmodel");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const geminiAPI = require("../gemini");
const { htmlToText } = require("html-to-text");

exports.uploadPost = async (req, res) => {
  try {
    const question = req.body.question?.trim();
    if (!question) {
      req.flash("error", "Please enter a question.");
      return res.redirect("/");
    }

    let extractedText = "";
    let fileType = "";

    // ✅ Handle PDF upload
    if (req.files?.pdf?.[0]) {
      const filePath = req.files.pdf[0].path;
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text.slice(0, 8000);
      fileType = "pdf";
    }

    // ✅ Handle Image upload
    if (req.files?.image?.[0]) {
      const filePath = req.files.image[0].path;
      const result = await Tesseract.recognize(filePath, "eng");
      const imageText = result.data.text.slice(0, 8000);

      if (extractedText) {
        extractedText += "\n\n" + imageText;
        fileType = "both";
      } else {
        extractedText = imageText;
        fileType = "image";
      }
    }

    // ✅ Ask Gemini with extracted text + question
    const geminiResponse = await geminiAPI.askGemini(
      extractedText,
      question,
      fileType
    );

    const cleanText = htmlToText(geminiResponse, {
      wordwrap: false,
      preserveNewlines: true,
    });

    // ✅ Save chat under the logged-in user
    let chat = await Chat.findOne({ _id: req.session.chatId, user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id });
      req.session.chatId = chat._id;
    }

    chat.title =
      chat.title === "Untitled Chat" ? question.slice(0, 50) : chat.title;
    chat.conversation.push({ prompt: question, response: cleanText });
    await chat.save();

    res.render("home", { conversation: chat.conversation, error: null });
  } catch (err) {
    console.error("Upload error:", err);
    req.flash("error", "Something went wrong while processing your request.");
    res.redirect("/");
  }
};

exports.newChatGet = async (req, res) => {
  const newChat = await Chat.create({ user: req.user._id });
  req.session.chatId = newChat._id;
  res.redirect("/");
};

exports.previousChatsGet = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("previousChats", { chats });
  } catch (err) {
    console.error("Previous chats error:", err);
    req.flash("error", "Unable to load previous chats.");
    res.redirect("/");
  }
};

exports.chatDetailGet = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!chat) {
      req.flash("error", "Chat not found or unauthorized.");
      return res.redirect("/previous-chats");
    }
    res.render("chatdetail", { chat });
  } catch (err) {
    console.error("Chat detail error:", err);
    req.flash("error", "Chat not found.");
    res.redirect("/previous-chats");
  }
};
