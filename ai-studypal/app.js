const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// DB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-studypal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "studypal-secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Passport config
const User = require("./models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

// Routes
app.use("/", require("./routes/homeRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/chatRoutes"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
