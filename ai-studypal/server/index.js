const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const geminiAPI = require("./gemini");
const Chat = require("../models/chatModel"); // Make sure filename is 'chatModel.js'
const { htmlToText } = require('html-to-text');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Mongoose DB connection

// Get the MongoDB URI from Render's environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-studypal";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// Multer setup for PDF upload
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

// GET: Home page
app.get("/", (req, res) => {
  res.render("home", { response: null, error: null });
});

// GET: View previous chats
app.get("/previous-chats", async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    res.render("show", { chats });
  } catch (err) {
    console.error("❌ Error fetching chats:", err);
    res.status(500).send("Unable to load previous chats.");
  }
});

// POST: Upload PDF + Ask Gemini

app.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const question = req.body.question;
    let pdfText = "";

    // Read PDF if uploaded
    if (req.file) {
      const pdfPath = req.file.path;
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text.slice(0, 8000);
    }

    // Get response from Gemini
    const geminiResponse = await geminiAPI.askGemini(pdfText, question);

    // ✅ Clean response HTML into plain text
    const cleanText = htmlToText(geminiResponse, {
      wordwrap: false,
      preserveNewlines: true
    });

    // ✅ Save question + cleaned response
    await Chat.create({
      title: question.slice(0, 100),
      content: cleanText
    });

    // Show result
    res.render("home", { response: cleanText, error: null });
  } catch (error) {
    console.error("❌ Error:", error);
    res.render("home", { response: null, error: "Something went wrong." });
  }
});





// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
