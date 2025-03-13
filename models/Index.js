const sequelize = require("../config/database");
const User = require("./User");
const RecoveryPlan = require("./RecoveryPlan");
const Injury = require("./Injury");
const Exercise = require("./Exercise");
const ExerciseCompletion = require("./ExerciseCompletion");
const Treatment = require("./Treatment.js");

// Define relationships

// User relationships
User.hasMany(RecoveryPlan, { foreignKey: "UserId" });
User.hasMany(Injury, { foreignKey: 'UserId' }); // User can have many injuries
User.hasMany(ExerciseCompletion, { foreignKey: 'UserId' });

// RecoveryPlan relationships
RecoveryPlan.belongsTo(User, { foreignKey: "UserId" });
RecoveryPlan.belongsTo(Injury, { foreignKey: "InjuryId" }); // RecoveryPlan belongs to an injury
RecoveryPlan.hasMany(ExerciseCompletion, { foreignKey: "PlanId" });
RecoveryPlan.hasMany(Treatment, { foreignKey: 'PlanId' }); // RecoveryPlan can have many treatments

// Injury relationships
Injury.hasMany(RecoveryPlan, { foreignKey: "InjuryId" });
Injury.belongsTo(User, { foreignKey: 'UserId' }); // Injury belongs to a user
Injury.hasMany(Treatment, { foreignKey: 'InjuryId' }); // Injury can have many treatments

// Exercise relationships
Exercise.hasMany(ExerciseCompletion, { foreignKey: "ExerciseId" });

// ExerciseCompletion relationships
ExerciseCompletion.belongsTo(RecoveryPlan, { foreignKey: "PlanId" });
ExerciseCompletion.belongsTo(Exercise, { foreignKey: "ExerciseId" });
ExerciseCompletion.belongsTo(User, { foreignKey: 'UserId' });

// Treatment relationships
Treatment.belongsTo(RecoveryPlan, { foreignKey: 'PlanId' }); // Treatment belongs to a RecoveryPlan
Treatment.belongsTo(Injury, { foreignKey: 'InjuryId' }); // Treatment belongs to an Injury


// Consider adding many-to-many relationships if needed
// For example, if a treatment can have multiple exercises:
// Treatment.belongsToMany(Exercise, { through: 'TreatmentExercises' });
// Exercise.belongsToMany(Treatment, { through: 'TreatmentExercises' });

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
    Treatment,
};