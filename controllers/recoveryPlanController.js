const { RecoveryPlan, Injury } = require("../models");

// Create a New Recovery Plan (simplified - no exercises)
exports.createRecoveryPlan = async (req, res) => {
    try {
        const { 
            user_id, 
            injury_id, 
            start_date, 
            end_date, 
            progress_status, 
            progress_feedback, 
            is_active 
        } = req.body;

        if (!user_id || !injury_id) {
            return res.status(400).json({ error: "Missing required fields: user_id and injury_id." });
        }

        console.log(`Creating recovery plan for User ID: ${user_id}, Injury ID: ${injury_id}`);

        // Optional: Check if injury exists
        const injury = await Injury.findByPk(injury_id);
        if (!injury) {
            return res.status(404).json({ error: "Injury not found." });
        }

        const newPlan = await RecoveryPlan.create({
            UserId: user_id,
            InjuryId: injury_id,
            StartDate: start_date ? new Date(start_date) : new Date(),
            EndDate: end_date ? new Date(end_date) : null,
            ProgressStatus: progress_status !== undefined ? progress_status : 0,
            ProgressFeedback: progress_feedback || "No feedback provided",
            IsActive: is_active !== undefined ? is_active : true,
        });

        console.log("Recovery Plan Created:", newPlan);

        res.status(201).json({
            message: "Recovery Plan Created",
            recoveryPlan: newPlan
        });
    } catch (error) {
        console.error("Error creating recovery plan:", error);
        res.status(500).json({ error: "Failed to create recovery plan", details: error.message });
    }
};

// Get All Recovery Plans
exports.getAllRecoveryPlans = async (req, res) => {
    try {
        const plans = await RecoveryPlan.findAll();
        res.json(plans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch recovery plans." });
    }
};

// Get a Single Recovery Plan
exports.getRecoveryPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await RecoveryPlan.findByPk(id, {
            include: [{ model: Injury }] // Include the Injury details
        });

        console.log(JSON.stringify(plan, null, 2));
        
        if (!plan) {
            return res.status(404).json({ error: "Recovery Plan not found" });
        }

        res.json(plan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch recovery plan." });
    }
};

// Update a Recovery Plan
exports.updateRecoveryPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress_status, progress_feedback, is_active } = req.body;

        const plan = await RecoveryPlan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ error: "Recovery Plan not found" });
        }

        await plan.update({
            ProgressStatus: progress_status !== undefined ? progress_status : plan.ProgressStatus,
            ProgressFeedback: progress_feedback || plan.ProgressFeedback,
            IsActive: is_active !== undefined ? is_active : plan.IsActive
        });

        res.json({ message: "Recovery Plan updated successfully", recoveryPlan: plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update recovery plan" });
    }
};

// Delete a Recovery Plan
exports.deleteRecoveryPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await RecoveryPlan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ error: "Recovery Plan not found" });
        }

        await plan.destroy();
        res.json({ message: "Recovery Plan deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete recovery plan" });
    }
};
