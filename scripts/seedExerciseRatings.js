// scripts/seedExerciseRatings.js
const { sequelize, ExerciseRating, User, Exercise } = require("../models");

async function seedExerciseRatings() {
  try {
    // ensure tables exist
    await sequelize.sync();

    // clear existing ratings
    await ExerciseRating.destroy({ where: {} });
    console.log("Cleared existing exercise ratings");

    // load all users & exercises
    const users     = await User.findAll({ attributes: ["UserId"] });
    const exercises = await Exercise.findAll({ attributes: ["ExerciseId"] });

    const sampleComments = [
      "Felt great!",
      "A bit challenging but doable",
      "Too easy",
      "Need to work on form",
      "Really helped my rehab",
      "Couldn’t complete full sets",
      "Perfect difficulty",
      "My favorite exercise"
    ];

    const ratingsToCreate = users.flatMap(({ UserId }) =>
      exercises.map(({ ExerciseId }) => ({
        UserId,
        ExerciseId,
        Rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1.0–5.0
        Comment:
          sampleComments[
            Math.floor(Math.random() * sampleComments.length)
          ]
      }))
    );

    await ExerciseRating.bulkCreate(ratingsToCreate);
    console.log(
      `Seeded ${ratingsToCreate.length} exercise ratings — one per user/exercise`
    );
  } catch (err) {
    console.error("Failed to seed exercise ratings:", err);
  } finally {
    process.exit();
  }
}

seedExerciseRatings();
