// scripts/seedExercises.js
//run *node scripts/seedExercises.js
const { sequelize, Exercise } = require("../models");

const seedExercises = async () => {
  try {
    await sequelize.sync(); // Ensure table exists

    // Clear the table first
    await Exercise.destroy({ where: {} });
    console.log("Cleared existing exercises");

    const exercises = [
      // Ankle Exercises
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

      // Lower Back Exercises
      {
        ExerciseName: "Pelvic Tilt",
        TargetMuscleGroup: "lower back",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://example.com/pelvic-tilt",
      },
      {
        ExerciseName: "Cat-Cow Stretch",
        TargetMuscleGroup: "lower back",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://example.com/cat-cow",
      },
      {
        ExerciseName: "Bird Dog",
        TargetMuscleGroup: "lower back",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/bird-dog",
      },
      {
        ExerciseName: "Glute Bridge",
        TargetMuscleGroup: "lower back",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/glute-bridge",
      },
      {
        ExerciseName: "Superman",
        TargetMuscleGroup: "lower back",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/superman",
      },
      {
        ExerciseName: "Resistance Band Deadlift",
        TargetMuscleGroup: "lower back",
        Equipment: "resistance band",
        Difficulty: 3,
        VideoGuide: "https://example.com/band-deadlift",
      },
      {
        ExerciseName: "Back Extensions on Stability Ball",
        TargetMuscleGroup: "lower back",
        Equipment: "stability ball",
        Difficulty: 3,
        VideoGuide: "https://example.com/stability-ball-back-extension",
      },
      {
        ExerciseName: "Dumbbell Romanian Deadlift",
        TargetMuscleGroup: "lower back",
        Equipment: "dumbbells",
        Difficulty: 4,
        VideoGuide: "https://example.com/romanian-deadlift",
      }
    ];

    await Exercise.bulkCreate(exercises);
    console.log("Exercises seeded successfully");
  } catch (err) {
    console.error("Failed to seed exercises:", err);
  } finally {
    await sequelize.close();
  }
};

seedExercises();
