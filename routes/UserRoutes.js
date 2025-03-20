const express = require("express");
const passport = require("passport");
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 
require('dotenv').config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Signup New User
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, dob, terms } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // Create a new user with retry logic
    let retries = 3;
    let newUser;
    
    while (retries > 0) {
      try {
        newUser = await User.create({
          Email: email,
          Password: password, // Should be hashed in production!
          FirstName: firstName,
          LastName: lastName,
          DateOfBirth: dob,
          TermsAgreed: terms,
          IsAdmin: false, 
          googleId: null,
          RegistrationDate: new Date()
        });
        break; 
      } catch (err) {
        if (err.message.includes('SQLITE_BUSY') && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          throw err; 
        }
      }
    }

    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: error.message });
  }
});

// Google Sign-In route
router.post("/google-login", async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload(); 
    const { sub: googleId, email, name, picture } = payload;

    // Check if the user exists
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // Try finding by email as fallback
      user = await User.findOne({ where: { Email: email } });
      
      if (user) {
        // Update existing user with Google ID
        await user.update({ googleId });
      } else {
        // Create new user
        const names = name ? name.split(' ') : ['', ''];
        user = await User.create({
          googleId,
          Email: email,
          FirstName: names[0] || '',
          LastName: names.slice(1).join(' ') || '',
          ProfilePicture: picture,
          TermsAgreed: true,
          RegistrationDate: new Date(),
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.UserId, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed: " + error.message });
  }
});

// Login with email/password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password (should use proper hashing in production)
    if (user.Password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.UserId, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { Password, ...userProfile } = user.dataValues;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['Password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a user by UserId
router.get("/:UserId", authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.UserId) !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized to view this profile" });
    }
    
    const user = await User.findByPk(req.params.UserId, {
      attributes: { exclude: ['Password'] }
    });
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:UserId", authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.UserId) !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized to modify this account" });
    }
    
    const user = await User.findByPk(req.params.UserId);
    if (user) {
      const { Email, Password: userPassword, ...updateData } = req.body; 
      
      await user.update(updateData);
      
      const { Password, ...userData } = user.dataValues; 
      res.json(userData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Get user from database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if current password is correct
    if (user.Password !== currentPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    // Update password 
    await user.update({ Password: newPassword });
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account
router.post("/delete-account", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;
    
    // Get user from database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Verify password
    if (user.Password !== password) {
      return res.status(401).json({ error: "Password is incorrect" });
    }
    
    // Delete user
    await user.destroy();
    
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user
router.delete("/:UserId", authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.UserId) !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized to delete this account" });
    }
    
    const user = await User.findByPk(req.params.UserId);
    if (user) {
      await user.destroy();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

module.exports = router;