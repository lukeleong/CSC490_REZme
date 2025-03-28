const express = require("express");
const router = express.Router();
const {
  createRating,
  getRatingsForExercise,
  updateRating
} = require("../controllers/exerciseRatingController");

router.post("/exercise-ratings", createRating);
router.get("/exercise-ratings/:exerciseId", getRatingsForExercise);
router.put("/exercise-ratings/:exerciseId/:userId", updateRating);

module.exports = router;
