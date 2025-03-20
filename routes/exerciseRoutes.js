const express = require("express");
const { getExercisesByBodyPart } = require("../controllers/exerciseController");

const router = express.Router();

router.get("/exercises/:bodyPart", getExercisesByBodyPart);

module.exports = router;
