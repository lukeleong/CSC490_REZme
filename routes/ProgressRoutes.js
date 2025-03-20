const express = require("express");
const {
    createProgress,
    getAllProgress,
    getProgressById,
    updateProgress,
    deleteProgress
} = require("../controllers/progressController");

const router = express.Router();

router.post("/progress", createProgress);
router.get("/progress", getAllProgress);
router.get("/progress/:id", getProgressById);
router.put("/progress/:id", updateProgress);
router.delete("/progress/:id", deleteProgress);

module.exports = router;
