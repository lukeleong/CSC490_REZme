const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExerciseCompletion = sequelize.define('ExerciseCompletion', {
    CompletionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    PlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'RecoveryPlans',
            key: 'PlanId',
        },
    },
    ExerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Exercises',
            key: 'ExerciseId'
        },
    },
    SetsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    RepsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    TimeTaken: {
        type: DataTypes.INTEGER, //Time in seconds
        allowNull: true,
    },
    DifficultyRating: {
        type: DataTypes.INTEGER,
        allowNull: true, // User rating of difficulty (1-4)
    },
    ProgressValue: {
        type: DataTypes.FLOAT,
        allowNull: true, // Represents improvement score
    },
    ProgressFeedback: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ModifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.NOW,
    },
});

module.exports = ExerciseCompletion;
