const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Exercise = sequelize.define("Exercise", {
  ExerciseId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ExerciseName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  InjuryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Injury",
      key: "InjuryId",
    },
  },
  Difficulty: {
    type: DataTypes.INTEGER, asdfasfas
    allowNull: false,
    validate: {
      min: 1,
      max: 4,
    },
  },
  VideoGuide: {
    type: DataTypes.STRING(255),
    allowNull: true, // Some exercises may not have a video guide
  },
  ExerciseName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});

module.exports = Exercise;
