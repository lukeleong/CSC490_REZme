const sequelize = require("../config/database");

const User = require("./User");
const RecoveryPlan = require("./RecoveryPlan");
const Injury = require("./Injury");
const Exercise = require("./Exercise");
const ExerciseCompletion = require("./ExerciseCompletion");
const ProgressTracker = require("./ProgressTracker");
const ExerciseRating = require("./ExerciseRating");
const RecoveryPlanExercise = require("./RecoveryPlanExercise");

// Define relationships
User.hasMany(RecoveryPlan, { foreignKey: "UserId" });
RecoveryPlan.belongsTo(User, { foreignKey: "UserId" });

RecoveryPlan.hasMany(ExerciseCompletion, { foreignKey: "PlanId" });
ExerciseCompletion.belongsTo(RecoveryPlan, { foreignKey: "PlanId" });

Injury.hasMany(RecoveryPlan, { foreignKey: "InjuryId" });
RecoveryPlan.belongsTo(Injury, { foreignKey: "InjuryId" });

RecoveryPlan.belongsToMany(Exercise, {
    through: "RecoveryPlanExercises",
    foreignKey: "RecoveryPlanId",
    otherKey: "ExerciseId"
});

Exercise.belongsToMany(RecoveryPlan, {
    through: "RecoveryPlanExercises",
    foreignKey: "ExerciseId",
    otherKey: "RecoveryPlanId"
});

Exercise.hasMany(ExerciseCompletion, { foreignKey: "ExerciseId" });
ExerciseCompletion.belongsTo(Exercise, { foreignKey: "ExerciseId" });

User.hasMany(ProgressTracker, { foreignKey: "UserId" });
ProgressTracker.belongsTo(User, { foreignKey: "UserId" });

Injury.hasMany(ProgressTracker, { foreignKey: "InjuryId" });
ProgressTracker.belongsTo(Injury, { foreignKey: "InjuryId" });

Injury.hasMany(Exercise, { foreignKey: "InjuryId" });
Exercise.belongsTo(Injury, { foreignKey: "InjuryId" });

User.hasMany(ExerciseRating, { foreignKey: "UserId" });
ExerciseRating.belongsTo(User, { foreignKey: "UserId" });

Exercise.hasMany(ExerciseRating, { foreignKey: "ExerciseId" });
ExerciseRating.belongsTo(Exercise, { foreignKey: "ExerciseId" });


// User.js
 User.hasMany(Injury, { foreignKey: 'UserId' });

// Injury.js
 Injury.belongsTo(User, { foreignKey: 'UserId' });

//sequelize.sync({ alter: true })  // Creates tables if not exist / updates structure
//    .then(() => console.log("Database synced"))
//    .catch((err) => console.error("Error syncing database:", err));

module.exports = {
    sequelize,
    User,
    RecoveryPlan,
    Injury,
    Exercise,
    ExerciseCompletion,
    ProgressTracker,
    ExerciseRating,
    RecoveryPlanExercise,
};
