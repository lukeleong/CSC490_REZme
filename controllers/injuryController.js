const { Injury } = require("../models");

// Create a new Injury record
exports.createInjury = async (req, res) => {
    try {
        console.log("Injury data received:", req.body);
        const injury = await Injury.create(req.body);
        res.status(201).json({ message: "Injury logged successfully!", injury_id: injury.InjuryId });
    } catch (error) {
        console.error("Error creating Injury:", error); // SHOW FULL ERROR
        res.status(500).json({ error: "Failed to create record", details: error.message });
    }
};

// Get all Injury records
exports.getAllInjuries = async (req, res) => {
    try {
        const injuries = await Injury.findAll();
        res.json(injuries);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch records" });
    }
};

// Get a single Injury by ID
exports.getInjuryById = async (req, res) => {
    try {
        const injury = await Injury.findByPk(req.params.id);
        if (!injury) return res.status(404).json({ error: "Not found" });

        res.json(injury);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch record" });
    }
};

// Update an Injury record
exports.updateInjury = async (req, res) => {
    try {
        const injury = await Injury.findByPk(req.params.id);
        if (!injury) return res.status(404).json({ error: "Not found" });

        await injury.update(req.body);
        res.json(injury);
    } catch (error) {
        res.status(500).json({ error: "Failed to update record" });
    }
};

// Delete an Injury record
exports.deleteInjury = async (req, res) => {
    try {
        const injury = await Injury.findByPk(req.params.id);
        if (!injury) return res.status(404).json({ error: "Not found" });

        await injury.destroy();
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete record" });
    }
};
