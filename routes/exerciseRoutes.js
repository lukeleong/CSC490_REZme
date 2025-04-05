const express = require("express");
const router = express.Router();
const { Exercise } = require("../models");

// GET /api/exercises/muscle-groups
router.get("/exercises/muscle-groups", async (req, res) => {
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
});

// GET /api/exercises/:id
router.get("/exercises/:id", async (req, res) => {
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
});

module.exports = router;
