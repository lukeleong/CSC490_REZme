const { Progress } = require('../models');

// Controller: Save progress
const saveProgress = async (req, res) => {
    try {
        const {
            userID,
            injuryID,
            painLevel,
            mobilityLevel,
            strength,
            endurance,
            mobility,
            progressNotes
        } = req.body;

        // Create a new progress entry in the database
        const newProgress = await Progress.create({
            userID,
            injuryID,
            painLevel,
            mobilityLevel,
            strength,
            endurance,
            mobility,
            progressNotes
        });

        res.status(201).json({
            message: 'Progress saved successfully',
            data: newProgress
        });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
};

// Controller: Fetch all progress for a specific user
const getProgressByUser = async (req, res) => {
    try {
        const { userID } = req.params;

        // Retrieve progress records from the database
        const progressData = await Progress.findAll({
            where: { userID },
            order: [['recordedAt', 'DESC']] // Sort by the most recent date
        });

        res.status(200).json(progressData);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

// Controller: Fetch progress for radar chart
const getRadarChartData = async (req, res) => {
    try {
        const { userID } = req.params;

        // Select specific fields for radar chart display
        const radarData = await Progress.findAll({
            where: { userID },
            attributes: ['painLevel', 'mobilityLevel', 'strength', 'endurance', 'mobility']
        });

        res.status(200).json(radarData);
    } catch (error) {
        console.error('Error fetching radar chart data:', error);
        res.status(500).json({ error: 'Failed to fetch radar chart data' });
    }
};

module.exports = {
    saveProgress,
    getProgressByUser,
    getRadarChartData
};
