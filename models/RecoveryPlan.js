const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecoveryPlan = sequelize.define('RecoveryPlan', {
    PlanId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'UserId'
        },
    },
    InjuryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Injury',
            key: 'InjuryId',
        },
    },
    ProgressStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, //0-100% progress
    },
    ProgressFeedback: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    EndDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
});

module.exports = RecoveryPlan;