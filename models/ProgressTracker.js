const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define('Progress', {
    progressID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // Reference your 'User' table
            key: 'userID',
        },
    },
    injuryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Injury', // Reference your 'Injury' table
            key: 'injuryID',
        },
    },
    painLevel: {
        type: DataTypes.INTEGER, // Scale: 1–10
        allowNull: false,
    },
    mobilityLevel: {
        type: DataTypes.INTEGER, // Scale: 1–10
        allowNull: false,
    },
    strength: {
        type: DataTypes.INTEGER, // Optional, scale: 1–10
        allowNull: true,
    },
    endurance: {
        type: DataTypes.INTEGER, // Optional, scale: 1–10
        allowNull: true,
    },
    mobility: {
        type: DataTypes.INTEGER, // Optional, scale: 1–10
        allowNull: true,
    },
    painReduction: {
        type: DataTypes.INTEGER, // Tracks improvement in pain levels
        allowNull: true,
    },
    progressNotes: {
        type: DataTypes.TEXT, // Additional notes for context
        allowNull: true,
    },
    progressFeedback: {
        type: DataTypes.TEXT, // User feedback for recovery progress
        allowNull: true,
    },
    recordedAt: {
        type: DataTypes.DATE, // Timestamp for tracking
        allowNull: false,
        defaultValue: sequelize.NOW,
    },
});

module.exports = Progress;
