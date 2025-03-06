// server.js
const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const { User, Injury, RecoveryPlan, Exercise, ExerciseCompletion } = require('./models');
const UserRoutes = require('./routes/UserRoutes');
const recoveryPlanRoutes = require("./routes/recoveryPlanRoutes");
const path = require('path');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`➡️ Received request: ${req.method} ${req.originalUrl}`);
  next();
});

console.log("Loading recovery plan routes..."); // Debugging log
app.use("/api", recoveryPlanRoutes);
console.log("Recovery plan routes loaded!"); // Debugging log

app.use(express.static(path.join(__dirname, "public")));

// Set up session management
app.use(session({
  secret: 'key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use('/users', UserRoutes);

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

// Sync database and start server
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Failed to sync database:', err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
