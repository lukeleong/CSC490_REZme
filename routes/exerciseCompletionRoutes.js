const express = require("express");
const router = express.Router();
const {
    createExerciseCompletion,
    getAllExerciseCompletions,
    getExerciseCompletionById,
    updateExerciseCompletion,
    deleteExerciseCompletion,
} = require("../controllers/exerciseCompletionController");



router.post('/', createExerciseCompletion);
router.get('/', getAllExerciseCompletions);
router.get('/:id', getExerciseCompletionById);
router.put('/:id', updateExerciseCompletion);
router.delete('/:id', deleteExerciseCompletion);

module.exports = router;
