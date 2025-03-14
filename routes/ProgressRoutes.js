const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// POST: Save progress data
router.post('/progress-tracker', progressController.saveProgress);

// GET: Fetch all progress for a specific user
router.get('/progress-tracker/:UserId', progressController.getProgressByUser);

// GET: Fetch radar chart data for a specific user
router.get('/radar-chart/:UserId', progressController.getRadarChartData);

module.exports = router;
