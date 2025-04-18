const express = require("express");
const {
    createRecoveryPlan,
    getAllRecoveryPlans,
    getRecoveryPlanById,
    updateRecoveryPlan,
    deleteRecoveryPlan,
    getExercisesByPlanId,
    getProgressDetails
} = require("../controllers/recoveryPlanController");


const router = express.Router();

router.post("/recovery-plans", createRecoveryPlan);
router.get("/recovery-plans", getAllRecoveryPlans);
router.get("/recovery-plans/:id", getRecoveryPlanById);
router.put("/recovery-plans/:id", updateRecoveryPlan);
router.delete("/recovery-plans/:id", deleteRecoveryPlan);
router.get("/recovery-plans/:planId/exercises", getExercisesByPlanId);
router.get("/recovery-plans/:id/progress-details", getProgressDetails);

module.exports = router;
