const sequelize = require("../config/database");
const User = require("./User");
const RecoveryPlan = require("./RecoveryPlan");
const Injury = require("./Injury");
const Exercise = require("./Exercise");
const ExerciseCompletion = require("./ExerciseCompletion");

// Define relationships
User.hasMany(RecoveryPlan, { foreignKey: "user_id" });
RecoveryPlan.belongsTo(User, { foreignKey: "user_id" });

RecoveryPlan.hasMany(ExerciseCompletion, { foreignKey: "plan_id" });
ExerciseCompletion.belongsTo(RecoveryPlan, { foreignKey: "plan_id" });

Injury.hasMany(RecoveryPlan, { foreignKey: "injury_id" });
RecoveryPlan.belongsTo(Injury, { foreignKey: "injury_id" });

Exercise.hasMany(ExerciseCompletion, { foreignKey: "exercise_id" });
ExerciseCompletion.belongsTo(Exercise, { foreignKey: "exercise_id" });

sequelize.sync({ alter: true })  // Creates tables if not exist / updates structure
    .then(() => console.log("Database synced"))
    .catch((err) => console.error("Error syncing database:", err));

module.exports = { User, RecoveryPlan, Injury, Exercise, ExerciseCompletion };
