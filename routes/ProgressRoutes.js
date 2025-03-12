const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// POST: Save progress data
router.post('/track-progress', progressController.saveProgress);

// GET: Fetch all progress for a specific user
router.get('/track-progress/:userID', progressController.getProgressByUser);

// GET: Fetch radar chart data for a specific user
router.get('/radar-chart/:userID', progressController.getRadarChartData);

module.exports = router;
