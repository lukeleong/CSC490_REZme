// server.js
const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const { User, Injury, RecoveryPlan, Exercise, ExerciseCompletion } = require('./models');
const UserRoutes = require('./routes/UserRoutes');
const recoveryPlanRoutes = require("./routes/recoveryPlanRoutes");
const path = require('path');
const app = express();
app.use(express.json());


// Set up session management
app.use(session({
  secret: 'key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/users', UserRoutes);
app.use("/api", recoveryPlanRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Server is working');
});

//Signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));  
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));  
});

// GET all Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all Injuries
app.get('/injuries', async (req, res) => {
  try {
    const injuries = await Injury.findAll();
    res.json(injuries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all Recovery Plans
app.get('/recovery-plans', async (req, res) => {
  try {
    const plans = await RecoveryPlan.findAll();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all Exercises
app.get('/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all Exercise Completions
app.get('/exercise-completions', async (req, res) => {
  try {
    const completions = await ExerciseCompletion.findAll();
    res.json(completions);
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
