const axios = require("axios");
const { marked } = require("marked");
require("dotenv").config();

console.log("Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? " Present" : " Missing");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing. Check your .env file.");
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(extractedText = "", userPrompt = "", fileType = "") {
  let prompt = "";

  if (!extractedText.trim()) {
    prompt = `You are a friendly and helpful AI assistant. Respond conversationally to this user query:\n"${userPrompt}"`;
  } else if (fileType === "pdf") {
    prompt = `You are a professional tutor. Based on the following PDF material:\n"""${extractedText}"""\nAnswer the user's question conversationally:\n"${userPrompt}"`;
  } else if (fileType === "image") {
    prompt = `You are a helpful AI that extracts information from images. The user uploaded an image. This is the extracted text:\n"""${extractedText}"""\nNow respond to their question based on this image text:\n"${userPrompt}"`;
  } else {
    prompt = `You are an AI combining text from both PDF and Image. PDF text:\n"""${extractedText}"""\nAnswer this user query conversationally:\n"${userPrompt}"`;
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  console.log("Sending request to Gemini API...");
  console.log("Prompt length:", prompt.length);

  try {
    const response = await axios.post(GEMINI_API_URL, requestBody);
    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log("Gemini API response received.");

    const html = marked.parse(rawText);
    return html;
  } catch (error) {
    console.error("Gemini API error caught!");

    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Error Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }

    return "<p style='color:red;'>Failed to fetch response from Gemini.</p>";
  }
}

module.exports = { askGemini };
