// seed.js

const mongoose = require('mongoose');
const Chat = require('./models/chatmodel'); // adjust path if needed

const MONGO_URI = 'mongodb://127.0.0.1:27017/ai-studypal'; // Update if different

const sampleChats = [
  {
    title: "Math Doubts",
    content: "Q: What is integration by parts?\nA: It's a technique of integration using the product rule in reverse.",
  },
  {
    title: "Physics Revision",
    content: "Q: Define Newton's 2nd law.\nA: F = ma, where F is force, m is mass, and a is acceleration.",
  },
  {
    title: "AI Study Plan",
    content: "Plan:\n1. Complete Machine Learning course.\n2. Start with TensorFlow or PyTorch.\n3. Build a mini project using Hugging Face.",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected.");

    await Chat.deleteMany({});
    console.log("Old chats deleted.");

    await Chat.insertMany(sampleChats);
    console.log("Sample chats inserted.");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding DB:", err);
  }
}

seedDB();
