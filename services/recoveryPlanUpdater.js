const { RecoveryPlan, ExerciseCompletion, RecoveryPlanExercise } = require("../models");

async function updatePlanProgress(planId) {
  // Get all completions for the plan
  const completions = await ExerciseCompletion.findAll({ where: { PlanId: planId } });
  
  // Group completions by ExerciseId
  const exerciseGroups = {};
  completions.forEach(completion => {
    const { ExerciseId, ProgressValue } = completion;
    if (!exerciseGroups[ExerciseId]) {
      exerciseGroups[ExerciseId] = [];
    }
    exerciseGroups[ExerciseId].push(completion);
  });
  
  // Get all planned exercises for the recovery plan.
  // This will include exercises even if they have no completion logs.
  const plannedExercises = await RecoveryPlanExercise.findAll({ where: { RecoveryPlanId: planId } });
  
  // If there are no planned exercises, nothing to update.
  if (!plannedExercises.length) return;
  
  let sumMaxProgress = 0;
  let countExercises = plannedExercises.length;
  
  // Loop through each planned exercise and determine its progress
  plannedExercises.forEach(planExercise => {
    const exerciseId = planExercise.ExerciseId;
    let maxProgress = 0;
    if (exerciseGroups[exerciseId]) {
      // If there are completions for this exercise, pick the highest ProgressValue
      maxProgress = Math.max(...exerciseGroups[exerciseId].map(c => c.ProgressValue));
    }
    // Otherwise, keep maxProgress = 0 for exercises without completions
    sumMaxProgress += maxProgress;
  });
  
  // Calculate the average status score, ensuring it doesn't exceed 100.
  const averageMaxProgress = sumMaxProgress / countExercises;
  let progressStatus = averageMaxProgress > 100 ? 100 : averageMaxProgress;
  
  // Optionally, set feedback based on the calculated progress.
  let feedback = "Keep it up!";
  if (progressStatus >= 100) {
    feedback = "Recovery complete! Great job.";
  } else if (progressStatus < 50) {
    feedback = "Try to improve consistency.";
  }
  
  // Build update data for the recovery plan.
  const updateData = {
    ProgressStatus: Math.round(progressStatus),
    ProgressFeedback: feedback
  };
  
  // If progress reaches 100, mark the plan as complete.
  if (progressStatus >= 100) {
    updateData.IsActive = false;
    updateData.EndDate = new Date();
  }
  
  await RecoveryPlan.update(updateData, { where: { PlanId: planId } });
}

module.exports = { updatePlanProgress };
