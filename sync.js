const sequelize = require("./config/database");
const User = require("./models/User");

sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));


async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database successfully synced.");
  } catch (error) {
    console.error("Error database syncing:", error);
  }
}

syncDatabase();

