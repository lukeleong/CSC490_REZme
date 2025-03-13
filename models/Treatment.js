const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Treatment = sequelize.define("Treatment", {
  TreatmentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  InjuryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Injury",
      key: "InjuryId",
    },
  },
  // Treatment details (e.g., exercise name, description, sets, reps, duration)
  ExerciseName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Sets: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Reps: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
  },
  // Add other relevant treatment fields here (e.g., rest duration, ice/heat application)
  RestDuration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
  },
  IceHeatApplication: {
    type: DataTypes.STRING(255), // e.g., "Ice pack for 20 minutes", "Heat pad for 15 minutes"
    allowNull: true,
  },
  // Timestamps for tracking treatment progress
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Status of the treatment (e.g., "ongoing", "completed", "paused")
  Status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "ongoing", // or "pending"
  },
});

module.exports = Treatment;