// scripts/seedExerciseRatings.js
// run with: node scripts/seedExerciseRatings.js
const { sequelize, ExerciseRating } = require("../models");

const seedExerciseRatings = async () => {
  try {
    await sequelize.sync(); // Ensure table exists

    // Clear existing data
    await ExerciseRating.destroy({ where: {} });
    console.log("Cleared existing exercise ratings");

    const ratings = [
      {
        UserId: 1,
        ExerciseId: 1,
        Rating: 4.5,
        Comment: "Felt really good on the ankle.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2,
        ExerciseId: 1,
        Rating: 3.0,
        Comment: "It’s okay, but not amazing.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 3,
        ExerciseId: 1,
        Rating: 5.0,
        Comment: "Best stretch ever.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 1,
        ExerciseId: 2,
        Rating: 4.0,
        Comment: "Easy to do and effective.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2,
        ExerciseId: 2,
        Rating: 4.2,
        Comment: "Really helps flexibility.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 4,
        ExerciseId: 3,
        Rating: 2.5,
        Comment: "Didn’t feel much from this.",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await ExerciseRating.bulkCreate(ratings);
    console.log("Exercise ratings seeded successfully");
  } catch (err) {
    console.error("Failed to seed ratings:", err);
  } finally {
    //await sequelize.close();
  }
};

seedExerciseRatings();
