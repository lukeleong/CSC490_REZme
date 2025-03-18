// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const { User, Injury, RecoveryPlan, Exercise, ExerciseCompletion, ProgressTracker } = require('./models');
const UserRoutes = require('./routes/userRoutes');
const recoveryPlanRoutes = require("./routes/RecoveryPlanRoutes");
const ProgressRoutes = require("./routes/ProgressRoutes");
const path = require('path');
const cors = require("cors");
const dotenv = require('dotenv');

const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://accounts.google.com https://apis.google.com https://www.gstatic.com 'unsafe-inline' 'unsafe-eval';"
  );
  next();
});

// Set up session management
app.use(session({
  secret: 'key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Request logger
app.use((req, res, next) => {
  console.log(`➡️ Received request: ${req.method} ${req.originalUrl}`);
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public'))); 

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

// Routes
app.use('/users', UserRoutes);
console.log("Loading recovery plan routes...");
app.use("/api", recoveryPlanRoutes);
console.log("Recovery plan routes loaded!");
console.log("Progress Tracking");
app.use("/api", ProgressRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Server is working');
});

// Google login route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback route
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Generate JWT token 
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Signup/Login routes
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));  
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));  
});

// API Routes
// GET all Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Sync database and start server
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Failed to sync database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));