const { Exercise } = require("../models");

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    console.error("Failed to fetch exercise:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new exercise
exports.createExercise = async (req, res) => {
  try {
    const newExercise = await Exercise.create(req.body);
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Failed to create exercise:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Update an existing exercise
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    
    await exercise.update(req.body);
    res.json(exercise);
  } catch (error) {
    console.error("Failed to update exercise:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Delete an exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    
    await exercise.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get exercise by muscle group
exports.getExercisesByMuscleGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;
    const exercises = await Exercise.findAll({
      where: {
        TargetMuscleGroup: muscleGroup
      }
    });
    
    if (exercises.length === 0) {
      return res.status(404).json({ message: "No exercises found for this muscle group" });
    }
    
    res.json(exercises);
  } catch (error) {
    console.error("Failed to fetch exercises by muscle group:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get exercises from external API by body part
exports.getExercisesByBodyPart = async (req, res) => {
  try {
    const { bodyPart } = req.params;
    const API_URL = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10&offset=0`;

    console.log(`Fetching exercises for body part: ${bodyPart}`);

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
            "x-rapidapi-key": "2bc91b2016msh93b040a88587a17p1d2e18jsn1bee8209e531", 
        },
    });

    console.log("API Response Status:", response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("ExerciseDB API Error Response:", errorText);
        return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("ExerciseDB API Data:", data);
    res.json(data);
  } catch (error) {
      console.error("Error fetching exercises:", error.message);
      res.status(500).json({ error: "Failed to fetch exercises", details: error.message });
  }
};

// Get muscle groups
exports.getMuscleGroups = async (req, res) => {
  try {
    const groups = await Exercise.findAll({
      attributes: ["TargetMuscleGroup"],
      group: ["TargetMuscleGroup"],
      raw: true
    });
    const uniqueGroups = groups.map(g => g.TargetMuscleGroup);
    res.json(uniqueGroups);
  } catch (error) {
    console.error("Failed to fetch muscle groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};