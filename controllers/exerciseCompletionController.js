const {ExerciseCompletion, RecoveryPlan, Exercise} = require('../models'); // Importing the model

// Controller: Create a new Exercise Completion
const createExerciseCompletion = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const {
            PlanId,
            ExerciseId,
            SetsCompleted,
            RepsCompleted,
            TimeTaken,
            DifficultyRating,
            ProgressFeedback
        } = req.body;


        const planExists = await RecoveryPlan.findByPk(PlanId);
        if (!planExists) {
            return res.status(400).json({error: `RecoveryPlan with PlanId ${PlanId} does not exist.`});
        }

        // Verify that ExerciseId exists in Exercise
        const exerciseExists = await Exercise.findByPk(ExerciseId);
        if (!exerciseExists) {
            return res.status(400).json({error: `Exercise with ExerciseId ${ExerciseId} does not exist.`});
        }
          console.log('Inserting into ExerciseCompletion:', {
            PlanId,
            ExerciseId,
            SetsCompleted,
            RepsCompleted,
            TimeTaken,
            DifficultyRating,
            ProgressFeedback,
        });
        const newCompletion = await ExerciseCompletion.create({
            PlanId,
            ExerciseId,
            SetsCompleted,
            RepsCompleted,
            TimeTaken,
            DifficultyRating,
            ProgressFeedback
        });
        res.status(201).json({
            message: 'Exercise completion record created successfully!',
            data: newCompletion,
        });

    }  catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
}

};

// Controller: Fetch all Exercise Completion records
const getAllExerciseCompletions = async (req, res) => {
    try {
        const completions = await ExerciseCompletion.findAll({
            include: [{
                model: Exercise, // Assuming Exercise is associated
                attributes: ['ExerciseId', 'ExerciseName'], // Get ExerciseName if needed
            }]
        });

        res.status(200).json(completions);
    } catch (error) {
        console.error('Error fetching exercise completions:', error);
        res.status(500).json({ error: 'Failed to fetch records.' });
    }
};

// Controller: Fetch a single Exercise Completion by ID
const getExerciseCompletionById = async (req, res) => {
    try {
        const {id} = req.params;
        const completion = await ExerciseCompletion.findByPk(id);
        if (!completion) {
            return res.status(404).json({error: 'Record not found.'});
        }
        res.status(200).json(completion);
    } catch (error) {
        console.error('Error fetching exercise completion:', error);
        res.status(500).json({error: 'Failed to fetch the record.'});
    }
};

// Controller: Update an Exercise Completion record
const updateExerciseCompletion = async (req, res) => {
    try {
        const {id} = req.params;
        const updated = await ExerciseCompletion.update(req.body, {
            where: {CompletionId: id},
        });
        if (!updated[0]) {
            return res.status(404).json({error: 'Record not found.'});
        }
        res.status(200).json({message: 'Record updated successfully!'});
    } catch (error) {
        console.error('Error updating exercise completion:', error);
        res.status(500).json({error: 'Failed to update the record.'});
    }
};

// Controller: Delete an Exercise Completion record
const deleteExerciseCompletion = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await ExerciseCompletion.destroy({
            where: {CompletionId: id},
        });
        if (!deleted) {
            return res.status(404).json({error: 'Record not found.'});
        }
        res.status(200).json({message: 'Record deleted successfully!'});
    } catch (error) {
        console.error('Error deleting exercise completion:', error);
        res.status(500).json({error: 'Failed to delete the record.'});
    }
};
const getExercisesByCompletion = async (req, res) => {
    try {
        const exercises = await Exercise.findAll({
            include: [{
                model: ExerciseCompletion,
                attributes: ['CompletionId', 'SetsCompleted', 'RepsCompleted', 'TimeTaken', 'DifficultyRating', 'ProgressFeedback'],
            }],
        });

        res.status(200).json(exercises);
    } catch (error) {
        console.error('Error fetching completed exercises:', error);
        res.status(500).json({ error: 'Failed to fetch exercises.' });
    }
};


module.exports = {
    createExerciseCompletion,
    getAllExerciseCompletions,
    getExerciseCompletionById,
    updateExerciseCompletion,
    deleteExerciseCompletion,
    getExercisesByCompletion,
};
