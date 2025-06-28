const axios = require("axios");
const { marked } = require("marked");

const GEMINI_API_KEY = "AIzaSyCXToxk8Nfinvfi1rAX_rm8lVHwZ1fhmoo"; // Replace with actual key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(pdfText, userPrompt) {
  let prompt = "";

if (pdfText.trim() === "") {
  prompt = `You are a friendly and helpful AI assistant. Respond naturally to the user's message: "${userPrompt}"`;
} else {
  prompt = `You are a friendly expert tutor. Based on the following material:\n"""${pdfText}"""\nAnswer this user query conversationally:\n"${userPrompt}"`;
}

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(GEMINI_API_URL, requestBody);
    const rawText = response.data.candidates[0].content.parts[0].text;
    const html = marked.parse(rawText);
    return html;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return "<p style='color:red;'>Failed to fetch response from Gemini.</p>";
  }
}

module.exports = { askGemini };
