const express = require("express");
const router = express.Router();
const { Exercise } = require("../models");

router.get("/muscle-groups", async (req, res) => {
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

module.exports = router;
