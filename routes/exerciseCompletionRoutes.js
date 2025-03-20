const express = require("express");
const {
    createExerciseCompletion,
    getAllExerciseCompletions,
    getExerciseCompletionById,
    updateExerciseCompletion,
    deleteExerciseCompletion
} = require("../controllers/exerciseCompletionController");

const router = express.Router();

router.post("/exercise-completions", createExerciseCompletion);
router.get("/exercise-completions", getAllExerciseCompletions);
router.get("/exercise-completions/:id", getExerciseCompletionById);
router.put("/exercise-completions/:id", updateExerciseCompletion);
router.delete("/exercise-completions/:id", deleteExerciseCompletion);

module.exports = router;
