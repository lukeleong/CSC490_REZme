const { RecoveryPlan, ExerciseCompletion, RecoveryPlanExercise } = require("../models");

async function updatePlanProgress(planId) {
  const completions = await ExerciseCompletion.findAll({ where: { PlanId: planId } });
  if (!completions.length) return;

  const plannedExercises = await RecoveryPlanExercise.count({ where: { RecoveryPlanId: planId } });

  let totalAdjustedProgress = 0;
  let totalCompletionRate = 0;
  let totalDifficulty = 0;
  let exerciseCount = 0;
  let completedExercises = 0; // Keep track of completed exercises

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

    // Calculate the average ProgressValue for all completions of the exercise
    const avgProgressValue = exerciseCompletions.reduce((acc, cur) => acc + cur.ProgressValue, 0) / exerciseCompletions.length;

    // Calculate completion rate based on the average progress value
    const completionRate = avgProgressValue < 75 ? avgProgressValue / 75 : 1; // Scaled up to 100% if Progress is 75 or above

    // Sum the values for weighted calculation
    totalAdjustedProgress += avgProgressValue;
    totalCompletionRate += completionRate;
    totalDifficulty += exerciseCompletions[0].DifficultyRating || 0; // Assuming the difficulty is the same for all completions of a specific exercise
    exerciseCount++;

    // Increment the completed exercises counter
    completedExercises++;
  }

  // Calculate averages for all exercises
  const avgProgress = totalAdjustedProgress / exerciseCount;
  const avgCompletionRate = totalCompletionRate / exerciseCount; // Average completion rate across all exercises

  // Difficulty penalty (exponentially scaled based on difficulty)
  const avgDifficulty = totalDifficulty / exerciseCount;
  const difficultyPenaltyFactor = avgDifficulty >= 3
    ? Math.pow((4.5 - avgDifficulty) / 4.5, 1.5)
    : 1;

  const adjustedProgress = avgProgress * difficultyPenaltyFactor;

  // Calculate progress status as the average of the adjusted progress and completion rate
  const progressStatus = (adjustedProgress + (avgCompletionRate * 100)) / 2;

  // Calculate completion rate for the entire plan
  const completionRateForPlan = completedExercises / plannedExercises;
  const cappedCompletionRate = Math.min(completionRateForPlan, 1);

  // Ensure the progress can reach 100% if both conditions are met:
  if (progressStatus < 100 && cappedCompletionRate >= 0.95 && adjustedProgress >= 90) {
    progressStatus = 100; // Mark as complete if both conditions are met
  }

  let feedback = "You're making good progress.";
  if (avgDifficulty >= 3.5) {
    feedback = "Difficulty is high. Consider easier exercises or reduce intensity.";
  } else if (avgCompletionRate < 0.5) {
    feedback = "Try to stay consistent with your exercises.";
  } else if (progressStatus >= 100) {
    feedback = "Recovery complete! Great job.";
  }

  const updateData = {
    ProgressStatus: Math.min(100, Math.round(progressStatus)),
    ProgressFeedback: feedback
  };

  if (progressStatus >= 100) {
    updateData.IsActive = false;
    updateData.EndDate = new Date();
  }

  await RecoveryPlan.update(updateData, { where: { PlanId: planId } });
}

module.exports = { updatePlanProgress };
