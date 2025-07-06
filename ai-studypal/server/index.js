const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const geminiAPI = require("./gemini");
const Chat = require("../models/chatmodel");
const { htmlToText } = require("html-to-text");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-studypal";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "studypal-secret",
  resave: false,
  saveUninitialized: true,
}));

const upload = multer({ dest: path.join(__dirname, "../uploads/") });

app.get("/new-chat", async (req, res) => {
  const newChat = await Chat.create({});
  req.session.chatId = newChat._id;
  res.redirect("/");
});

app.get("/", async (req, res) => {
  if (!req.session.chatId) {
    const newChat = await Chat.create({});
    req.session.chatId = newChat._id;
  }

  const chat = await Chat.findById(req.session.chatId);
  res.render("home", { conversation: chat?.conversation || [], error: null });
});

app.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const question = req.body.question;
    let pdfText = "";

    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(buffer);
      pdfText = pdfData.text.slice(0, 8000);
    }

    const geminiResponse = await geminiAPI.askGemini(pdfText, question);
    const cleanText = htmlToText(geminiResponse, {
      wordwrap: false,
      preserveNewlines: true,
    });

    let chat = await Chat.findById(req.session.chatId);

    if (!chat) {
      chat = await Chat.create({});
      req.session.chatId = chat._id;
      return res.redirect("/");
    }

    chat.title = chat.title === "Untitled Chat" ? question.slice(0, 50) : chat.title;
    chat.conversation.push({ prompt: question, response: cleanText });
    await chat.save();

    res.render("home", { conversation: chat.conversation, error: null });
  } catch (err) {
    console.error("Error handling chat:", err);
    res.render("home", { conversation: [], error: "Something went wrong." });
  }
});

app.get("/previous-chats", async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    res.render("previousChats", { chats });
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).send("Unable to load previous chats.");
  }
});

app.get("/chat/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    console.log("🔍 Chat ID:", req.params.id);
    console.log("📄 Chat Found:", chat);

    if (!chat || !Array.isArray(chat.conversation)) {
      console.warn("❌ Invalid chat document format.");
      return res.status(404).send("Chat not found or invalid format.");
    }

    res.render("chatDetail", { chat });
  } catch (err) {
    console.error("❗ Error rendering chatDetail route:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
