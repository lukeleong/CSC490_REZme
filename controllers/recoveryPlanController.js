const {
  RecoveryPlan,
  Exercise,
  Injury,
  RecoveryPlanExercise,
  ExerciseCompletion
} = require("../models");

// Create a new recovery plan
exports.createRecoveryPlan = async (req, res) => {
  try {
    const { user_id, injury_id, difficulty, equipment } = req.body;

    if (!user_id || !injury_id || !difficulty || !equipment) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if a recovery plan already exists for this injury
    const existingPlan = await RecoveryPlan.findOne({
      where: {
        UserId: user_id,
        InjuryId: injury_id,
        IsActive: true
      }
    });
    if (existingPlan) {
      return res.status(400).json({ error: "A recovery plan for this injury already exists." });
    }

    const injury = await Injury.findByPk(injury_id);
    if (!injury) {
      return res.status(404).json({ error: "Injury not found." });
    }

    const targetMuscleGroup = injury.InjuryLocation.toLowerCase();

    const matchingExercises = await Exercise.findAll({
      where: {
        Public: true,
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

    const newPlan = await RecoveryPlan.create({
      UserId: user_id,
      InjuryId: injury_id,
      ProgressStatus: 0,
      ProgressFeedback: "Generated based on your inputs",
      StartDate: new Date(),
      IsActive: true
    });

    await Promise.all(matchingExercises.map(ex =>
      RecoveryPlanExercise.create({
        RecoveryPlanId: newPlan.PlanId,
        ExerciseId: ex.ExerciseId
      })
    ));

    res.status(201).json({
      message: "Recovery Plan created successfully with matching exercises.",
      recoveryPlan: newPlan
    });

  } catch (err) {
    console.error("Error creating recovery plan:", err);
    res.status(500).json({ error: "Failed to create recovery plan." });
  }
};

// Get all recovery plans (optionally filtered by user)
exports.getAllRecoveryPlans = async (req, res) => {
  try {
    const plans = await RecoveryPlan.findAll({
      where: req.query.user_id ? { UserId: req.query.user_id } : undefined,
      include: [{
        model: Injury,
        attributes: ["InjuryType"]
      }]
    });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recovery plans." });
  }
};

// Get a single recovery plan by ID
exports.getRecoveryPlanById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const plan = await RecoveryPlan.findByPk(id, {
      include: [{ model: Injury }]
    });

    if (!plan) {
      return res.status(404).json({ error: "Recovery Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recovery plan." });
  }
};

// Update recovery plan status/feedback manually
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

// Delete a recovery plan
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

// Get exercises assigned to a plan
exports.getExercisesByPlanId = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await RecoveryPlan.findByPk(planId, {
      include: [
        {
          model: Exercise,
          through: { attributes: [] }
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

// Get breakdown of recovery progress calculations
exports.getProgressDetails = async (req, res) => {
  try {
    const planId = parseInt(req.params.id, 10);
    const completions = await ExerciseCompletion.findAll({ where: { PlanId: planId } });

    if (!completions.length) {
      return res.json({ message: "No completions yet." });
    }

    const plannedExercises = await RecoveryPlanExercise.count({ where: { RecoveryPlanId: planId } });

    let totalAdjustedProgress = 0;
    let totalCompletionRate = 0;
    let totalDifficulty = 0;
    let exerciseCount = 0;
    let completedExercises = 0; // To track how many exercises were completed

    // Group completions by ExerciseId
    const exerciseGroups = {};
    completions.forEach(completion => {
      const { ExerciseId, ProgressValue, DifficultyRating } = completion;
      if (!exerciseGroups[ExerciseId]) {
        exerciseGroups[ExerciseId] = [];
      }
      exerciseGroups[ExerciseId].push(completion);
    });

    // Process each exercise's completion data
    for (const exerciseId in exerciseGroups) {
      const exerciseCompletions = exerciseGroups[exerciseId];

      // Sort completions by date (descending) and get the last 3 completions
      const sortedCompletions = exerciseCompletions.sort((a, b) => new Date(b.CompletionDate) - new Date(a.CompletionDate));
      const lastThreeCompletions = sortedCompletions.slice(0, 3);

      // Calculate the average ProgressValue for the last 3 completions
      const avgProgressValue = lastThreeCompletions.reduce((acc, cur) => acc + cur.ProgressValue, 0) / lastThreeCompletions.length;

      // Calculate completion rate based on the average progress value:
      // If avgProgressValue is below 75, scale it; otherwise, consider it complete (1)
      const completionRate = avgProgressValue < 75 ? avgProgressValue / 75 : 1;

      totalAdjustedProgress += avgProgressValue;
      totalCompletionRate += completionRate;

      // Assuming difficulty is the same for the last three completions
      totalDifficulty += lastThreeCompletions[0].DifficultyRating || 0;

      exerciseCount++;
      completedExercises++;
    }

    // Calculate averages across all exercises
    const avgProgress = totalAdjustedProgress / exerciseCount;
    const avgDifficulty = totalDifficulty / exerciseCount;
    const avgCompletionRate = totalCompletionRate / exerciseCount; // Average completion rate across exercises

    // Difficulty penalty (exponentially scaled based on difficulty)
    const difficultyPenaltyFactor = avgDifficulty >= 3
      ? Math.pow((4.5 - avgDifficulty) / 4.5, 1.5)
      : 1;

    const adjustedProgress = avgProgress * difficultyPenaltyFactor;

    // Calculate weighted progress
    let weightedProgressRaw = (adjustedProgress * 0.7) + (avgCompletionRate * 100 * 0.3);
    let weightedProgress = Math.min(100, weightedProgressRaw);

    // Adjust completion rate based on the number of exercises completed
    const completionRateForPlan = completedExercises / plannedExercises;
    const cappedCompletionRate = Math.min(completionRateForPlan, 1);

    // Ensure the progress can reach 100% if both conditions are met:
    // 1. Progress (weightedProgress) must be at least 90%
    // 2. Completion (cappedCompletionRate) must be at least 95%
    if (weightedProgress < 100 && cappedCompletionRate >= 0.95 && adjustedProgress >= 90) {
      weightedProgress = 100; // Mark as complete if both conditions are met
    }

    // Feedback logic based on progress and difficulty
    let feedback = "You're making good progress.";
    if (avgDifficulty >= 3.5) {
      feedback = "Difficulty is high. Consider easier exercises or reduce intensity.";
    } else if (avgCompletionRate < 0.5) {
      feedback = "Try to stay consistent with your exercises.";
    } else if (weightedProgress >= 100) {
      feedback = "Recovery complete! Great job.";
    }

    res.json({
      avgProgress,
      avgDifficulty,
      difficultyPenaltyFactor,
      adjustedProgress,
      completionRate: cappedCompletionRate, // Average completion rate across exercises (capped)
      weightedProgress,
      weightedProgressRaw,
      feedback
    });
  } catch (error) {
    console.error("Error fetching progress details:", error);
    res.status(500).json({ error: "Failed to fetch progress details." });
  }
};


