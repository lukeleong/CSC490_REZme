const express = require('express');
const router = express.Router();

const {
    createExerciseCompletion,
    getAllExerciseCompletions,
    getExerciseCompletionById,
    updateExerciseCompletion,
    deleteExerciseCompletion,
    getExercisesByCompletion,
} = require('../controllers/ExerciseCompletionController');

router.post('/', createExerciseCompletion);
router.get('/', getAllExerciseCompletions);
router.get('/:id', getExerciseCompletionById);
router.put('/:id', updateExerciseCompletion);
router.delete('/:id', deleteExerciseCompletion);
router.get('/completed', getExercisesByCompletion);


module.exports = router;
