const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Signup New User
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, dob, terms } = req.body;

    // Email dupe check
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // Create a new user
    const newUser = await User.create({
      Email: email,
      Password: password,
      FirstName: firstName,
      LastName: lastName,
      DateOfBirth: dob,
      TermsAgreed: terms,
      IsAdmin: false, 
    });

    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
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

module.exports = router;
