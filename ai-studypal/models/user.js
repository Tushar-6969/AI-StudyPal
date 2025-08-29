const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  createdAt: { type: Date, default: Date.now },

  // 🔑 Each user can have multiple chats
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    }
  ]
});

// Adds password hashing and salting via passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
