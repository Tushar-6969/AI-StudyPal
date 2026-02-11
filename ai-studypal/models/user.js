const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,

  // 🔥 NEW PROFILE FIELDS
  name: {
    type: String,
    trim: true
  },

  profilePic: {
    type: String,
    default: "/images/profile.jpg"
  },

  bio: {
    type: String,
    maxlength: 300,
    trim: true
  },

  // 📊 Resume-Level Stats
  stats: {
    totalChats: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 },
    documentsProcessed: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now },

  // 🔑 Each user can have multiple chats
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    }
  ],

  // 🔥 Google OAuth Support
  googleId: String
});

// Password hashing via passport
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
