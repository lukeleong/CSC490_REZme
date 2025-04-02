const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Injury = sequelize.define("Injury", {
    InjuryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "UserId",
        },
    },
    InjuryType: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    InjuryLocation: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    InjurySeverity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10, // Severity scale from 1 to 10
        },
    },
    PainLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 10, // Initial pain level from 0 to 10
        },
    },
    MobilityLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 10, // Initial mobility level from 0 to 10
        },
    },
    StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    LastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
});

module.exports = Injury;
