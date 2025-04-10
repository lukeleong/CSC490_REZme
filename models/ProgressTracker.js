const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProgressTracker = sequelize.define('ProgressTracker', {
    ProgressId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Reference 'User' table
            key: 'UserId',
        },
    },
    InjuryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Injuries', // reference Injury table
            key: 'InjuryId',
        },
    },
    PainLevel: {
        type: DataTypes.INTEGER, // Scale: 1–10
        allowNull: false,
    },
    MobilityLevel: {
        type: DataTypes.INTEGER, // Scale: 1–10
        allowNull: false,
    },
    ProgressNotes: {
        type: DataTypes.TEXT, // Additional notes for context
        allowNull: true,
    },
    RecordedAt: {
        type: DataTypes.DATE, // Timestamp for tracking
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
});

module.exports = ProgressTracker;
