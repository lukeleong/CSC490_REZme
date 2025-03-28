// server.js
const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const { User, Injury, RecoveryPlan, Exercise, ExerciseCompletion,ProgressTracker } = require('./models');
const UserRoutes = require('./routes/UserRoutes');
const recoveryPlanRoutes = require("./routes/RecoveryPlanRoutes");
const ProgressRoutes = require("./routes/ProgressRoutes");
const ExerciseCompletionRoutes = require("./routes/ExerciseCompletionRoutes")
//const ExerciseRoutes = require('./routes/ExerciseRoutes');
const path = require('path');
const cors = require("cors");

const app = express();




app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.use(cors());

app.use((req, res, next) => {
  console.log(`➡️ Received request: ${req.method} ${req.originalUrl}`);
  next();
});

console.log("Loading recovery plan routes..."); // Debugging log
app.use("/api", recoveryPlanRoutes);
console.log("Recovery plan routes loaded!"); // Debugging log

console.log("Progress Tracking");
app.use("/api", ProgressRoutes);
console.log('User Model:', User);



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

app.get('/api/progress-tracker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'progress-tracker.html'));
});
app.use('/', ProgressRoutes);


app.get('/exercise-completion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','exercise-completion.html'));
});
app.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit-exercise.html'));
});


app.use('/api/exercise-completion', ExerciseCompletionRoutes);

app.get('/api/exercise-completion', async (req, res) => {
    try {
        const completions = await ExerciseCompletion.findAll();
        res.json(completions); // Return JSON data
    } catch (error) {
        console.error('Error fetching exercise completions:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/exercises', async (req, res) => {
    try {
        const exercises = await Exercise.findAll(); // Adjust query based on your database
        res.json(exercises); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ message: 'Failed to fetch exercises' });
    }
});








app.use(express.static(path.join(__dirname, "public")));
// Sync database and start server
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Failed to sync database:', err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
