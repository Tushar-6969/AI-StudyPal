const mongoose = require('mongoose')
const Chat = require('./models/chatmodel') // path to chat model file

// mongo uri for local db  change if using atlas or remote
const MONGO_URI = 'mongodb://127.0.0.1:27017/ai-studypal'

const sampleChats = [
  {
    title: "Math Doubts",
    content: "Q: What is integration by parts?\nA: It's a technique of integration using the product rule in reverse",
  },
  {
    title: "Physics Revision",
    content: "Q: Define Newton's 2nd law\nA: F = ma, where F is force, m is mass, and a is acceleration",
  },
  {
    title: "AI Study Plan",
    content: "Plan:\n1. Complete Machine Learning course\n2. Start with TensorFlow or PyTorch\n3. Build a mini project using Hugging Face",
  },
]

// seed function to load data into db
async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("mongodb connected")

    await Chat.deleteMany({})
    console.log("old chats cleared")

    await Chat.insertMany(sampleChats)
    console.log("sample chats inserted")

    mongoose.connection.close()  // close connection when done
  } catch (err) {
    console.error("error while seeding db", err)
  }
}

seedDB()
