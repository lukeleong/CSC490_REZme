const { RecoveryPlan, Exercise, Injury, RecoveryPlanExercise } = require("../models");

// Create a New Recovery Plan (simplified - no exercises)
exports.createRecoveryPlan = async (req, res) => {
    try {
      const { user_id, injury_id, difficulty, equipment } = req.body;
  
      if (!user_id || !injury_id || !difficulty || !equipment) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      // Fetch injury to confirm and get InjuryLocation
      const injury = await Injury.findByPk(injury_id);
      if (!injury) {
        return res.status(404).json({ error: "Injury not found." });
      }
  
      const targetMuscleGroup = injury.InjuryLocation.toLowerCase();
  
      // Find exercises that match injury location, difficulty, and equipment
      const matchingExercises = await Exercise.findAll({
        where: {
          TargetMuscleGroup: targetMuscleGroup,
          Difficulty: difficulty,
          Equipment: equipment
        }
      });
  
      if (!matchingExercises.length) {
        return res.status(404).json({
          error: "No matching exercises found for the selected location, difficulty, and equipment."
        });
      }
  
      // Create new recovery plan
      const newPlan = await RecoveryPlan.create({
        UserId: user_id,
        InjuryId: injury_id,
        ProgressStatus: 0,
        ProgressFeedback: "Generated based on your inputs",
        StartDate: new Date(),
        IsActive: true
      });
  
      // Link each exercise to the recovery plan
      await Promise.all(matchingExercises.map(ex => {
        return RecoveryPlanExercise.create({
          RecoveryPlanId: newPlan.PlanId,
          ExerciseId: ex.ExerciseId
        });
      }));
  
      res.status(201).json({
        message: "Recovery Plan created successfully with matching exercises.",
        recoveryPlan: newPlan
      });
  
    } catch (err) {
      console.error("Error creating recovery plan:", err);
      res.status(500).json({ error: "Failed to create recovery plan." });
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

// Fetch exercises tied to a recovery plan
exports.getExercisesByPlanId = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await RecoveryPlan.findByPk(planId, {
      include: [
        {
          model: Exercise,
          through: { attributes: [] }, // Exclude join table fields
        }
      ]
    });

    if (!plan) {
      return res.status(404).json({ error: "Recovery plan not found" });
    }

    res.json(plan.Exercises);
  } catch (err) {
    console.error("Error fetching exercises:", err);
    res.status(500).json({ error: "Failed to fetch exercises." });
  }
};
