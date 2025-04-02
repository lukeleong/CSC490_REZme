const express = require("express");
const {
    createInjury,
    getAllInjuries,
    getInjuryById,
    updateInjury,
    deleteInjury
} = require("../controllers/injuryController");

const router = express.Router();

router.post("/injuries", createInjury);
router.get("/injuries", getAllInjuries);
router.get("/injuries/:id", getInjuryById);
router.put("/injuries/:id", updateInjury);
router.delete("/injuries/:id", deleteInjury);
router.get('/muscle-groups', (req, res) => {
    const muscleGroups = ['quadriceps', 'hamstrings', 'biceps', 'triceps', 'calves', 'shoulders', 'back'];
    return res.json(muscleGroups);
  });

module.exports = router;
