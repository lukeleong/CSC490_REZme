// scripts/seedExercises.js
const { sequelize, Exercise } = require("../models"); // adjust path if needed

const seedExercises = async () => {
  try {
    await sequelize.sync(); // Make sure tables exist

    const exercises = [
      {
        ExerciseName: "Ankle Alphabet",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://example.com/ankle-alphabet",
      },
      {
        ExerciseName: "Towel Stretch",
        TargetMuscleGroup: "ankle",
        Equipment: "towel",
        Difficulty: 1,
        VideoGuide: "https://example.com/towel-stretch",
      },
      {
        ExerciseName: "Calf Raises",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/calf-raises",
      },
      {
        ExerciseName: "Resistance Band Dorsiflexion",
        TargetMuscleGroup: "ankle",
        Equipment: "resistance band",
        Difficulty: 2,
        VideoGuide: "https://example.com/dorsiflexion",
      },
      {
        ExerciseName: "Heel Walking",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/heel-walking",
      },
    ];

    await Exercise.bulkCreate(exercises);
    console.log("✅ Exercises seeded successfully");
  } catch (err) {
    console.error("❌ Failed to seed exercises:", err);
  } finally {
    await sequelize.close();
  }
};

seedExercises();
