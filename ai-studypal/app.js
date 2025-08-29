// app.js
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// DB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-studypal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware & view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "studypal-secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Passport config
const User = require("./models/user");

// Local strategy (existing)
passport.use(new LocalStrategy(User.authenticate()));

// Google OAuth2 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Try to find an existing user by googleId
      let user = await User.findOne({ googleId: profile.id });

      // If not found, try to link to an existing local account with same email
      if (!user) {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (email) {
          user = await User.findOne({ username: email });
          if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // Otherwise create a new user (no password)
        user = await User.create({
          username: email || `google_${profile.id}`,
          googleId: profile.id
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Passport serialize / deserialize (passport-local-mongoose)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals for templates
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
