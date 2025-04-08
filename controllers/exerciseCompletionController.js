const { ExerciseCompletion, RecoveryPlanExercise } = require("../models");
const { updatePlanProgress } = require("../services/recoveryPlanUpdater");
const calculateProgressValue = require('../services/calculateProgressValue');


exports.createExerciseCompletion = async (req, res) => {
  try {
    const { PlanId, ExerciseId, SetsCompleted, RepsCompleted, TimeTaken } = req.body;

    // Validate association between RecoveryPlan and Exercise
    const isLinked = await RecoveryPlanExercise.findOne({
      where: {
        RecoveryPlanId: PlanId,
        ExerciseId: ExerciseId,
      },
    });

    if (!isLinked) {
      return res.status(400).json({
        error: "This exercise is not part of the selected recovery plan.",
      });
    }

    // Calculate progress value BEFORE saving
    const progressValue = calculateProgressValue({
      SetsCompleted,
      RepsCompleted,
      TimeTaken: TimeTaken || 0,
    });

    const completion = await ExerciseCompletion.create({
      ...req.body,
      ProgressValue: progressValue,
    });

    // Update plan progress
    await updatePlanProgress(PlanId);

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

    // Recalculate progress after update
    await updatePlanProgress(completion.PlanId);

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

    const planId = completion.PlanId;

    await completion.destroy();

    // Update recovery plan after deletion
    await updatePlanProgress(planId);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
};
