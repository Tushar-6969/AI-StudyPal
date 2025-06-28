const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const geminiAPI = require("./gemini");
const Chat = require("../models/chatmodel");
const { htmlToText } = require("html-to-text");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// load mongodb uri from enviornment or use local fallback
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-studypal";

// connect to mongodb using mongoose
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb successfully");
  })
  .catch((err) => {
    console.error("mongodb connection error:", err);
  });

// set up view engine and midleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// configure multer to store uploded pdfs
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

// render the home page
app.get("/", (req, res) => {
  res.render("home", { response: null, error: null });
});

// fetch and display previous chats from the databse
app.get("/previous-chats", async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    res.render("show", { chats });
  } catch (err) {
    console.error("error fetching chats:", err);
    res.status(500).send("unable to load previous chats.");
  }
});

// handle form submission: parse pdf and send query to gemini
app.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const question = req.body.question;
    let pdfText = "";

    // if a pdf was uploaded, read and extract its text
    if (req.file) {
      const pdfPath = req.file.path;
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text.slice(0, 8000); // limit text lenght
    }

    // ask gemini api using the pdf text and user question
    const geminiResponse = await geminiAPI.askGemini(pdfText, question);

    // convert the html response into plain readable text
    const cleanText = htmlToText(geminiResponse, {
      wordwrap: false,
      preserveNewlines: true,
    });

    // save the original question and ai response in the database
    await Chat.create({
      title: question.slice(0, 100),
      content: cleanText,
    });

    // render the response on the home page
    res.render("home", { response: cleanText, error: null });
  } catch (error) {
    console.error("error:", error);
    res.render("home", { response: null, error: "something went wrong." });
  }
});

// start the express server
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
