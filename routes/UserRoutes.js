const express = require("express");
const passport = require("passport");
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 
require('dotenv').config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup New User
router.post("/signup", async (req, res) => {
  try {
    console.log("Starting signup process...");
    const { email, password, confirmPassword, firstName, lastName, dob, terms } = req.body;

    // Check for existing user
    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      console.log("Email already exists:", email);
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
        console.log("Creating new user...");
        newUser = await User.create({
          Email: email,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          DateOfBirth: dob,
          TermsAgreed: terms,
          IsAdmin: false, 
          googleId: null,
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

    console.log("User created successfully:", newUser);
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a user by UserId
router.get("/:UserId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.UserId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a user
router.put("/:UserId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.UserId);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a user
router.delete("/:UserId", async (req, res) => {
  try {
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

// Google Sign-In route
router.post("/google-login", async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    console.log("Verifying Google token...");
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload(); 
    const { sub: googleId, email, name, picture } = payload;
    console.log("Google auth successful for:", email);

    // Check if the user already exists in the database
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // Try finding by email as fallback
      user = await User.findOne({ where: { Email: email } });
      
      if (user) {
        // If user exists with this email but no googleId, update their record
        await user.update({ googleId });
      } else {
        // If the user doesn't exist, create a new user
        console.log("Creating new user from Google login");
        user = await User.create({
          googleId,
          Email: email,
          FirstName: name?.split(' ')[0] || '',
          LastName: name?.split(' ').slice(1).join(' ') || '',
          ProfilePicture: picture,
          TermsAgreed: true,
          RegistrationDate: new Date(),
        });
      }
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user.UserId, email: user.Email },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" } 
    );

    console.log("Google login successful, token generated");
    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed: " + error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email); 
    
    // Find the user
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.Password !== password) {
      console.log("Password mismatch");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("Login successful for:", email);
    
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

module.exports = router;
