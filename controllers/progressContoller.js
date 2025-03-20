const { ProgressTracker } = require("../models");

// Create a new ProgressTracker record
exports.createProgress = async (req, res) => {
    try {
        const progress = await ProgressTracker.create(req.body);
        res.status(201).json(progress);
    } catch (error) {
        console.error("Error creating ProgressTracker:", error);
        res.status(500).json({ error: "Failed to create record" });
    }
};

// Get all ProgressTracker records
exports.getAllProgress = async (req, res) => {
    try {
        const progress = await ProgressTracker.findAll();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch records" });
    }
};

// Get a single ProgressTracker by ID
exports.getProgressById = async (req, res) => {
    try {
        const progress = await ProgressTracker.findByPk(req.params.id);
        if (!progress) return res.status(404).json({ error: "Not found" });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch record" });
    }
};

// Update a ProgressTracker record
exports.updateProgress = async (req, res) => {
    try {
        const progress = await ProgressTracker.findByPk(req.params.id);
        if (!progress) return res.status(404).json({ error: "Not found" });

        await progress.update(req.body);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: "Failed to update record" });
    }
};

// Delete a ProgressTracker record
exports.deleteProgress = async (req, res) => {
    try {
        const progress = await ProgressTracker.findByPk(req.params.id);
        if (!progress) return res.status(404).json({ error: "Not found" });

        await progress.destroy();
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete record" });
    }
};
