// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const { User, Injury, RecoveryPlan, Exercise, ExerciseCompletion, ProgressTracker } = require('./models');
const recoveryPlanRoutes = require("./routes/recoveryPlanRoutes");
const progressRoutes = require("./routes/progressRoutes");
const exerciseCompletionRoutes = require("./routes/exerciseCompletionRoutes");
const injuryRoutes = require("./routes/injuryRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const exerciseRatingRoutes = require("./routes/exerciseRatingRoutes");
const path = require('path');
const cors = require("cors");

const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());


// JWT Authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token is invalid or expired" });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header not found" });
  }
};
exports.authenticateJWT = authenticateJWT;


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
  secret: process.env.SESSION_SECRET || 'default_secret_key', 
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  } 
}));

// Request logger
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });
    
    if (!user) {
      // Try finding by email as fallback
      user = await User.findOne({ where: { Email: profile.emails[0].value } });
      
      if (user) {
        // Update existing user with Google ID
        await user.update({ googleId: profile.id });
      } else {
        // Create new user
        user = await User.create({
          googleId: profile.id,
          Email: profile.emails[0].value,
          FirstName: profile.name.givenName || profile.displayName.split(' ')[0],
          LastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' '),
          TermsAgreed: true,
          RegistrationDate: new Date()
        });
      }
    }
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.UserId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Register Routes
console.log("Loading API routes...");
const UserRoutes = require('./routes/UserRoutes');
app.get('/test-admin-check', authenticateJWT, (req, res) => {
  res.json({ message: 'Test admin check route working' });
});
app.use('/users', UserRoutes);
app.use("/api", recoveryPlanRoutes);
app.use("/api", progressRoutes);
app.use("/api", exerciseCompletionRoutes);
app.use("/api", injuryRoutes);
app.use("/api", exerciseRoutes);
app.use("/api", exerciseRatingRoutes);

console.log("All API routes loaded!");
// Serve static files 
app.use(express.static(path.join(__dirname, 'public'))); 

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
  const token = jwt.sign(
    { 
      id: req.user.UserId, 
      email: req.user.Email,
      isAdmin: req.user.IsAdmin || false 
    },
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});

// HTML routes
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));  
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));  
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Test routes
app.get('/test-direct', (req, res) => {
  res.json({ message: "Direct test route working" });
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset_password.html'));
});

app.post('/reset-password', (req, res) => {
  req.url = '/users/reset-password';
  app.handle(req, res);
});

// Sync database and start server
sequelize.sync({ force: true })
  .then(() => console.log('Database synced successfully'))
  .catch((err) => console.error('Failed to sync database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Serve static files (Must be at the end)
app.use(express.static(path.join(__dirname, 'public'))); 
