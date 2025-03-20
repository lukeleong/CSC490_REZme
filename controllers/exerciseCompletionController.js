const { ExerciseCompletion } = require("../models");

// Create a new ExerciseCompletion record
exports.createExerciseCompletion = async (req, res) => {
    try {
        const completion = await ExerciseCompletion.create(req.body);
        res.status(201).json(completion);
    } catch (error) {
        console.error("Error creating ExerciseCompletion:", error);
        res.status(500).json({ error: "Failed to create record" });
    }
};

// Get all ExerciseCompletion records
exports.getAllExerciseCompletions = async (req, res) => {
    try {
        const completions = await ExerciseCompletion.findAll();
        res.json(completions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch records" });
    }
};

// Get a single ExerciseCompletion by ID
exports.getExerciseCompletionById = async (req, res) => {
    try {
        const completion = await ExerciseCompletion.findByPk(req.params.id);
        if (!completion) return res.status(404).json({ error: "Not found" });

        res.json(completion);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch record" });
    }
};

// Update an ExerciseCompletion record
exports.updateExerciseCompletion = async (req, res) => {
    try {
        const completion = await ExerciseCompletion.findByPk(req.params.id);
        if (!completion) return res.status(404).json({ error: "Not found" });

        await completion.update(req.body);
        res.json(completion);
    } catch (error) {
        res.status(500).json({ error: "Failed to update record" });
    }
};

// Delete an ExerciseCompletion record
exports.deleteExerciseCompletion = async (req, res) => {
    try {
        const completion = await ExerciseCompletion.findByPk(req.params.id);
        if (!completion) return res.status(404).json({ error: "Not found" });

        await completion.destroy();
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete record" });
    }
};
