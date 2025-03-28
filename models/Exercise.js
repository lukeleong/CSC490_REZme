const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Exercise = sequelize.define("Exercise", {
  ExerciseId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ExerciseName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  TargetMuscleGroup: {
    type: DataTypes.STRING(100),
    allowNull: false, // e.g., "lower back", "hamstrings"
  },
  Equipment: {
    type: DataTypes.STRING(100),
    allowNull: true, // e.g., "body weight", "resistance band"
  },
  Difficulty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 4,
    },
  },
  VideoGuide: {
    type: DataTypes.STRING(255),
    allowNull: true, // Optional video tutorial URL
  },
}, {
  timestamps: true,
});

module.exports = Exercise;
