const {ProgressTracker, User, Injury} = require('../models');

// Controller: Save progress
const saveProgress = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const {
            UserId,
            InjuryId,
            PainLevel,
            MobilityLevel,
            Strength,
            Endurance,
            Mobility,
            ProgressNotes
        } = req.body;

        const userExists = await User.findByPk(UserId);
        if (!userExists) {
            return res.status(404).json({error: `User with Id ${UserId}not found`});
        }
        const injuryExists = await Injury.findByPk(InjuryId);
        if (!injuryExists) {
            return res.status(404).json({error: `Injury with Id ${InjuryId} not found`});
        }

        // Create a new progress entry in the database
        const newProgress = await ProgressTracker.create({
            UserId,
            InjuryId,
            PainLevel,
            MobilityLevel,
            Strength,
            Endurance,
            Mobility,
            ProgressNotes
        });

        res.status(201).json({
            message: 'Progress saved successfully',
            data: newProgress
        });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({error: 'Failed to save progress'});
    }
};

// Controller: Fetch all progress for a specific user
const getProgressByUser = async (req, res) => {
    try {
        const {UserId} = req.params;

        // Retrieve progress records from the database
        const progressData = await ProgressTracker.findAll({
            where: {UserId},
            order: [['recordedAt', 'DESC']] // Sort by the most recent date
        });

        res.status(200).json(progressData);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({error: 'Failed to fetch progress'});
    }
};

// Controller: Fetch progress for radar chart
const getRadarChartData = async (req, res) => {
    try {
        const {UserId} = req.params;

        // Select specific fields for radar chart display
        const radarData = await ProgressTracker.findAll({
            where: {UserId},
            attributes: ['painLevel', 'mobilityLevel', 'strength', 'endurance', 'mobility']
        });

        res.status(200).json(radarData);
    } catch (error) {
        console.error('Error fetching radar chart data:', error);
        res.status(500).json({error: 'Failed to fetch radar chart data'});
    }
};

module.exports = {
    saveProgress,
    getProgressByUser,
    getRadarChartData
};
