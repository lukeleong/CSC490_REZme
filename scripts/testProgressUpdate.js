const readline = require("readline");
const { ExerciseCompletion } = require("../models");
const { updatePlanProgress } = require("../services/recoveryPlanUpdater");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    })
  );
}

async function testManualCompletion() {
  const confirm = await ask("Do you want to clear the ExerciseCompletion table first? (yes/no): ");

  if (confirm === "yes" || confirm === "y") {
    await ExerciseCompletion.destroy({ where: {} });
    console.log("ExerciseCompletion table cleared.");
  }

  const planId = 1;
  const exercises = [3,5]; // Testing for ExerciseId 3 and 5
  const testCases = [
    { ProgressValue: 5, DifficultyRating: 2.0 },
    { ProgressValue: 20, DifficultyRating: 3.8 },
    { ProgressValue: 20, DifficultyRating: 1.9 },
    { ProgressValue: 60, DifficultyRating: 3.1 },
    { ProgressValue: 80, DifficultyRating: 4.0 }
  ];

  // Loop through the exercises (3 and 5) and create completions for each
  for (const exerciseId of exercises) {
    console.log(`Inserting test cases for ExerciseId ${exerciseId}`);

    for (const [index, test] of testCases.entries()) {
      await ExerciseCompletion.create({
        PlanId: planId,
        ExerciseId: exerciseId,
        SetsCompleted: 3,
        RepsCompleted: 10,
        TimeTaken: 100,
        ...test
      });

      console.log(`Inserted test ${index + 1} for ExerciseId ${exerciseId}: PV ${test.ProgressValue}, DR ${test.DifficultyRating}`);
    }
  }

  // Update progress for the plan after the test completions
  await updatePlanProgress(planId);
  console.log("Progress updated for PlanId:", planId);
}

testManualCompletion();
