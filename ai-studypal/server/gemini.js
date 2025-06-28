const axios = require("axios");
const { marked } = require("marked");

// use env variable instead of hardcoding the api key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(pdfText, userPrompt) {
  let prompt = "";

  // check if pdf is empty or not
  if (pdfText.trim() === "") {
    prompt = `You are a friendly and helpful AI assistant. Respond naturally to the user's message: "${userPrompt}"`;
  } else {
    prompt = `You are a friendly expert tutor. Based on the following material:\n"""${pdfText}"""\nAnswer this user query conversationally:\n"${userPrompt}"`;
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    // send post req to gemini api with the prompt
    const response = await axios.post(GEMINI_API_URL, requestBody);

    // extract the raw text and convert it to html using marked
    const rawText = response.data.candidates[0].content.parts[0].text;
    const html = marked.parse(rawText);
    return html;
  } catch (error) {
    console.error("gemini api error:", error.response?.data || error.message);
    return "<p style='color:red;'>failed to fetch response from gemini.</p>";
  }
}

module.exports = { askGemini };
