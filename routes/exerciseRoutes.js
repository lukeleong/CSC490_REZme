const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

// Exercise routes
router.get("/exercises", exerciseController.getAllExercises);
router.get("/exercises/muscle-groups", exerciseController.getMuscleGroups);
router.get("/exercises/:id", exerciseController.getExerciseById);
router.post("/exercises", exerciseController.createExercise);
router.put("/exercises/:id", exerciseController.updateExercise);
router.delete("/exercises/:id", exerciseController.deleteExercise);
router.get("/exercises/target-muscle/:muscleGroup", exerciseController.getExercisesByMuscleGroup);
//router.get("/exercises/body-part/:bodyPart", exerciseController.getExercisesByBodyPart);

module.exports = router;