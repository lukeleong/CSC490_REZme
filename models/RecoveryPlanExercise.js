// models/RecoveryPlanExercise.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RecoveryPlanExercise = sequelize.define("RecoveryPlanExercise", {
  RecoveryPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "RecoveryPlans",
      key: "PlanId",
    },
    onDelete: "CASCADE",
    primaryKey: true,
  },
  ExerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Exercises",
      key: "ExerciseId",
    },
    onDelete: "CASCADE",
    primaryKey: true,
  },
}, {
  timestamps: true, // Optional if you don't want createdAt/updatedAt
  tableName: "RecoveryPlanExercises"
});

module.exports = RecoveryPlanExercise;
