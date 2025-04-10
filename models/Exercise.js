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
    allowNull: false,
  },
  Equipment: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Difficulty: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 4,
    },
  },
  VideoGuide: {
    type: DataTypes.STRING(255),
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
  TargetTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  RestTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Instruction: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Exercise;
