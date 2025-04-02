const sequelize = require("../config/database");
const User = require("./User");
const RecoveryPlan = require("./RecoveryPlan");
const Injury = require("./Injury");
const Exercise = require("./Exercise");
const ExerciseCompletion = require("./ExerciseCompletion");
const ProgressTracker = require("./ProgressTracker");

// Define relationships
User.hasMany(RecoveryPlan, { foreignKey: "UserId" });
RecoveryPlan.belongsTo(User, { foreignKey: "UserId" });

RecoveryPlan.hasMany(ExerciseCompletion, { foreignKey: "PlanId" });
ExerciseCompletion.belongsTo(RecoveryPlan, { foreignKey: "PlanId" });

Injury.hasMany(RecoveryPlan, { foreignKey: "InjuryId" });
RecoveryPlan.belongsTo(Injury, { foreignKey: "InjuryId" });

Exercise.hasMany(ExerciseCompletion, { foreignKey: "ExerciseId" });
ExerciseCompletion.belongsTo(Exercise, { foreignKey: "ExerciseId" });

User.hasMany(ProgressTracker, { foreignKey: "UserId" });
ProgressTracker.belongsTo(User, { foreignKey: "UserId" });

Injury.hasMany(ProgressTracker, { foreignKey: "InjuryId" });
ProgressTracker.belongsTo(Injury, { foreignKey: "InjuryId" });

// User.js
User.hasMany(Injury, { foreignKey: 'UserId' });

// Injury.js
Injury.belongsTo(User, { foreignKey: 'UserId' });
//sequelize.sync({ alter: true })  // Creates tables if not exist / updates structure
//    .then(() => console.log("Database synced"))
//    .catch((err) => console.error("Error syncing database:", err));

module.exports = { sequelize, User, RecoveryPlan, Injury, Exercise, ExerciseCompletion,ProgressTracker};
