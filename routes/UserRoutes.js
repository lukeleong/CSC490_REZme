console.log('UserRoutes.js file has been loaded!');
const path = require('path');
const express = require("express");
const crypto = require('crypto');
const passport = require("passport");
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models'); 
require('dotenv').config();
const authenticateJWT = require('../server').authenticateJWT;
console.log("Value of authenticateJWT after import:", authenticateJWT); 
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const nodemailer = require('nodemailer');
const transporter = require('./mailer');
const fetch = require("node-fetch");

router.get("/test-route", (req, res) => {
  console.log('Inside /test-route');
  res.send("Test route works!");
});

router.get("/findUsers", authenticateJWT, async (req, res) => {
  console.log('Inside /findUsers route');  
  console.log('Authenticated user:', req.user);
  console.log('req.query:', req.query);
  
  try {
    // Check if the user is an admin
    const adminUser = await User.findByPk(req.user.id);
    if (!adminUser || !adminUser.IsAdmin) {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const { userId, email } = req.query;
    console.log('userId from query:', userId);
    console.log('email from query:', email);

    const whereClause = {};

    if (userId) {
      whereClause.UserId = {
        [Op.like]: `%${userId}%`
      };
    }

    if (email) {
      whereClause.Email = {
        [Op.like]: `%${email}%`
      };
    }

    console.log('whereClause:', whereClause);

    // Find users 
    const users = await User.findAll({
      where: whereClause,
      limit: 10 
    });

    console.log('Found users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error in /findUsers:', error);
    res.status(500).json({ error: error.message });
  }
});

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
          Password: password, 
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
      { 
        id: user.UserId, 
        email: user.Email,
        isAdmin: user.IsAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed: " + error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { Email: email } });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.Password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const token = jwt.sign(
      { 
        id: user.UserId,  
        email: user.Email,
        isAdmin: user.IsAdmin || false 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get current user profile
router.get("/profile", authenticateJWT, async (req, res) => {
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
      attributes: { exclude: [] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a user by UserId
router.get("/admin-check", authenticateJWT, async (req, res) => {
  console.log("Inside /admin-check route (using server.js middleware)");
  console.log("req.user:", req.user);
  console.log("Email from JWT for query:", req.user.email);
  try {
    const user = await User.findOne({ where: { Email: req.user.email } });
    console.log("User found (by email):", user);
    if (!user) {
      return res.status(401).json({
        error: "User not found - please login again",
        action: "logout"
      });
    }
    res.json({
      isAdmin: user.IsAdmin === true
    });
  } catch (error) {
    console.error("Error in /admin-check (using server.js middleware):", error);
    res.status(500).json({ error: 'Error checking admin status' });
  }
});

router.put("/:UserId", authenticateJWT, async (req, res) => {
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

router.get("/:userId", authenticateJWT, async (req, res) => {
  const userId = req.params.userId;
  console.log('Fetching user with ID:', userId);
  console.log('Authenticated user:', req.user);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.warn(`User with ID ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log('Found user:', user.toJSON());
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user", details: error.message });
  }
});

// Change password
router.post("/change-password", authenticateJWT, async (req, res) => {
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
router.post("/delete-account", authenticateJWT, async (req, res) => {
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
router.delete("/:UserId", authenticateJWT, async (req, res) => {
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


// Middleware to check admin status
const checkAdminStatus = async (req, res, next) => {
  console.log('Inside checkAdminStatus middleware');
  console.log('req.user:', req.user);
  console.log('req.user.id:', req.user.id); // Added this line
  try {
    const user = await User.findByPk(req.user.id);
    console.log('User found in checkAdminStatus:', user);
    if (!user || user.IsAdmin !== true) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    res.status(500).json({ error: 'Error checking admin status' });
  }
};

router.get("/admin-check", authenticateJWT, async (req, res) => {
  console.log("Inside /admin-check route (using server.js middleware)");
  console.log("req.user:", req.user);
  console.log("Email from JWT for query:", req.user.email); // Add this line
  try {
    const user = await User.findOne({ where: { Email: req.user.email } });
    console.log("User found (by email):", user);
    if (!user) {
      return res.status(401).json({
        error: "User not found - please login again",
        action: "logout"
      });
    }

    res.json({
      isAdmin: user.IsAdmin === true
    });
  } catch (error) {
    console.error("Error in /admin-check (using server.js middleware):", error);
    res.status(500).json({ error: 'Error checking admin status' });
  }
});

// Admin user update (with additional admin-specific fields)
router.put("/:UserId/admin", authenticateJWT, checkAdminStatus, async (req, res) => {
  try {
    const userId = req.params.UserId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fields that can be updated by admin
    const updateFields = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      DateOfBirth: req.body.DateOfBirth,
      IsAdmin: req.body.IsAdmin !== undefined ? req.body.IsAdmin : user.IsAdmin,
      Password: req.body.Password
    };

    // Update user
    await user.update(updateFields);

    // Return updated user 
    const { Password, ...userData } = user.dataValues;
    res.json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin user deletion (with password verification)
router.post("/:UserId/admin-delete", authenticateJWT, checkAdminStatus, async (req, res) => {
  try {
    const { password, userId } = req.body;
    
    // Verify admin's password
    const adminUser = await User.findByPk(req.user.id);
    if (adminUser.Password !== password) {
      return res.status(401).json({ error: "Admin password is incorrect" });
    }

    // Find user to delete
    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deleting the last admin
    const adminCount = await User.count({ where: { IsAdmin: true } });
    if (userToDelete.IsAdmin && adminCount <= 1) {
      return res.status(400).json({ error: "Cannot delete the last admin user" });
    }

    // Delete user
    await userToDelete.destroy();
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin-only)
router.get("/all", authenticateJWT, checkAdminStatus, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['Password'] },
      limit: Number(limit),
      offset: Number(offset),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ where: { Email: email } });
      if (!user) {
          return res.status(404).json({ error: "Email not found" });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

      // Save token to user record 
      await user.update({ resetToken, resetTokenExpiry: tokenExpiry });

      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Request',
          text: `Click the link to reset your password: ${resetLink}`
      });

      res.json({ message: 'Password reset link sent to your email!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/reset_password.html'));
});

router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  
  try {
      const user = await User.findOne({ where: { Email: email } });
      
      if (!user || user.resetToken !== token || user.resetTokenExpiry < new Date()) {
          return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Update user's password and remove the reset token
      await user.update({
          Password: newPassword, 
          resetToken: null,
          resetTokenExpiry: null
      });

      res.json({ message: 'Password successfully reset!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/ask-hf-ai', authenticateJWT, async (req, res) => {
  try {
    const hf_api_token = "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"; 
    const { question } = req.body;
    const model_name = "mistralai/Mistral-7B-Instruct-v0.2"; 

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const prompt = `
The following is a conversation with an AI fitness assistant that provides helpful, accurate, and safe advice about exercise, injuries, and recovery.

Question: ${question}
Answer:`;

    const api_url = `https://api-inference.huggingface.co/models/${model_name}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hf_api_token}`
    };

    const payload = {
      inputs: prompt,
      parameters: {
        max_length: 150,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false
      }
    };

    console.log("Sending request to Hugging Face:", payload);

    const response = await fetch(api_url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Hugging Face API Error:', errorData);
      return res.status(response.status).json({ 
        error: `Failed to get answer from Hugging Face: ${errorData.error || response.statusText}` 
      });
    }

    const result = await response.json();
    console.log('HF API response:', result);

    // Handle different response formats
    let answer = '';
    if (Array.isArray(result) && result[0] && typeof result[0].generated_text === 'string') {
      answer = result[0].generated_text.trim();
    } else if (typeof result === 'string') {
      answer = result.trim();
    } else if (typeof result.generated_text === 'string') {
      answer = result.generated_text.trim();
    } else {
      console.warn('Unexpected Hugging Face API response format:', result);
      return res.status(500).json({ error: 'Unexpected response format from Hugging Face.' });
    }

    //Clean Answer
    if (answer.toLowerCase().includes('question:')) {
      answer = answer.substring(0, answer.toLowerCase().indexOf('question:')).trim();
    }

    res.json({ answer });

  } catch (error) {
    console.error('Error calling Hugging Face Inference API:', error);
    res.status(500).json({ error: 'Failed to get answer from AI.' });
  }
});

module.exports = router;