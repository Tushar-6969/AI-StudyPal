const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  createdAt: { type: Date, default: Date.now }
});

// Adds password hashing and salting via passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
