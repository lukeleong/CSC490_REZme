const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Exercise = require("./Exercise");

const ExerciseRating = sequelize.define("ExerciseRating", {
  RatingId: {
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
  ExerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Exercises",
      key: "ExerciseId",
    },
  },
  Rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  Comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = ExerciseRating;
