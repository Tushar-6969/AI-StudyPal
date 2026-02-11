// app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const profileRoutes = require("./routes/profile");


const User = require("./models/user"); // make sure user model has googleId, name, profilePic fields

const app = express();
const PORT = process.env.PORT || 5000;

/* --------------------- MONGODB --------------------- */
// prefer MONGODB_URI, fallback to MONGO_URI, else localhost
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-studypal";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected:", MONGO_URI.startsWith("mongodb://127.0.0.1") ? "local" : "remote"))
  .catch(err => console.error("MongoDB connection error:", err));

/* --------------------- MIDDLEWARE / VIEW ENGINE --------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use("/uploads", express.static("uploads"));


/*  If deployed behind a proxy (like Render), trust proxy for secure cookies */
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/* --------------------- SESSION --------------------- */
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "studypal-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {}
};
if (process.env.NODE_ENV === "production") {
  // use secure cookies in production (HTTPS)
  sessionOptions.cookie.secure = true;
}
app.use(session(sessionOptions));

/* --------------------- PASSPORT --------------------- */
app.use(passport.initialize());
app.use(passport.session());

// Local strategy (passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* --------------------- GOOGLE STRATEGY --------------------- */
/*
  Important:
  - Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment (Render env vars)
  - Set GOOGLE_CALLBACK_URL to your deployed callback (eg. https://ai-studypal-1.onrender.com/auth/google/callback)
  - If GOOGLE_CALLBACK_URL not set, this falls back to the Render URL below.
*/
const CALLBACK_FALLBACK = "https://ai-studypal-1.onrender.com/auth/google/callback";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || CALLBACK_FALLBACK
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || (profile.name && `${profile.name.givenName || ""} ${profile.name.familyName || ""}`.trim());
      const photo = profile.photos?.[0]?.value;

      // 1) Try find by googleId
      let user = await User.findOne({ googleId });

      // 2) If not found, try to link to an existing account by email (username used as email)
      if (!user && email) {
        user = await User.findOne({ username: email });
        if (user) {
          user.googleId = googleId;
          user.email = user.email || email;
          user.name = user.name || name;
          user.profilePic = user.profilePic || photo;
          await user.save();
          return done(null, user);
        }
      }

      // 3) If still no user, create a new one
      if (!user) {
        const newUser = new User({
          username: email || `google_${googleId}`,
          email: email || undefined,
          googleId,
          name: name || undefined,
          profilePic: photo || undefined
        });
        await newUser.save();
        return done(null, newUser);
      }

      // 4) If found by googleId, ensure fields are up-to-date
      let changed = false;
      if (!user.name && name) { user.name = name; changed = true; }
      if (!user.profilePic && photo) { user.profilePic = photo; changed = true; }
      if (!user.email && email) { user.email = email; changed = true; }
      if (changed) await user.save();

      return done(null, user);
    } catch (err) {
      console.error("Google strategy error:", err);
      return done(err, null);
    }
  }
));

/* --------------------- TEMPLATE LOCALS --------------------- */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

/* --------------------- ROUTES --------------------- */
// keep your existing route files (homeRoutes, authRoutes, chatRoutes)
app.use("/", require("./routes/homeRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/chatRoutes"));
app.use("/profile", profileRoutes);

/* --------------------- START --------------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Google callback URL used:", process.env.GOOGLE_CALLBACK_URL || CALLBACK_FALLBACK);
});
