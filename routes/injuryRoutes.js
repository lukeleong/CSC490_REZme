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

module.exports = router;
