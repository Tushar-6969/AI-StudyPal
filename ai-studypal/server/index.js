const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const geminiAPI = require("./gemini");
const Chat = require("../models/chatmodel");
const User = require("../models/user");
const { htmlToText } = require("html-to-text");
const Tesseract = require("tesseract.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-studypal", {
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
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

const upload = multer({ dest: path.join(__dirname, "../uploads/") });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be logged in first!");
  res.redirect("/login");
}

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username });
    await User.register(newUser, password);
    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration error. Username might already exist.");
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Invalid username or password."
}), async (req, res) => {
  const existingChat = await Chat.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (existingChat) {
    req.session.chatId = existingChat._id;
  } else {
    const newChat = await Chat.create({ user: req.user._id });
    req.session.chatId = newChat._id;
  }
  req.flash("success", "Logged in successfully!");
  res.redirect("/");
});

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.chatId = null;
    req.flash("success", "You have logged out successfully.");
    res.redirect("/");
  });
});

app.get("/", async (req, res) => {
  let conversation = [];
  if (req.isAuthenticated() && req.session.chatId) {
    const chat = await Chat.findById(req.session.chatId);
    conversation = chat?.conversation || [];
  }
  res.render("home", { conversation, error: null });
});

// Main Upload Route
app.post("/", isLoggedIn, upload.fields([{ name: "pdf" }, { name: "image" }]), async (req, res) => {
  try {
    const question = req.body.question;
    let extractedText = "";
    let fileType = "";

    // Handle PDF
    if (req.files?.pdf?.[0]) {
      const filePath = req.files.pdf[0].path;
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text.slice(0, 8000);
      fileType = "pdf";
    }

    // Handle Image if no PDF or in addition
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

    const geminiResponse = await geminiAPI.askGemini(extractedText, question, fileType);

    const cleanText = htmlToText(geminiResponse, { wordwrap: false, preserveNewlines: true });

    let chat = await Chat.findById(req.session.chatId);
    if (!chat) {
      chat = await Chat.create({ user: req.user._id });
      req.session.chatId = chat._id;
    }

    chat.title = chat.title === "Untitled Chat" ? question.slice(0, 50) : chat.title;
    chat.user = req.user._id;
    chat.conversation.push({ prompt: question, response: cleanText });
    await chat.save();

    res.render("home", { conversation: chat.conversation, error: null });
  } catch (err) {
    console.error("Error handling chat:", err);
    req.flash("error", "Something went wrong while processing your request.");
    res.redirect("/");
  }
});

app.get("/new-chat", isLoggedIn, async (req, res) => {
  const newChat = await Chat.create({ user: req.user._id });
  req.session.chatId = newChat._id;
  res.redirect("/");
});

app.get("/previous-chats", isLoggedIn, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render("previousChats", { chats });
  } catch (err) {
    console.error("Error fetching chats:", err);
    req.flash("error", "Unable to load previous chats.");
    res.redirect("/");
  }
});

app.get("/chat/:id", isLoggedIn, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) {
      req.flash("error", "Chat not found or unauthorized.");
      return res.redirect("/previous-chats");
    }
    res.render("chatdetail", { chat });
  } catch (err) {
    req.flash("error", "Chat not found.");
    res.redirect("/previous-chats");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
