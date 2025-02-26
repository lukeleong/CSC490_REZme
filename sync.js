const sequelize = require("./config/database");
const User = require("./models/User");

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); 
    console.log("Database successfully synced.");
  } catch (error) {
    console.error("Error database syncing:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
