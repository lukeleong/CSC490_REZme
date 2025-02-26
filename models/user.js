const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  termsAgreed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  unit_preference: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  profile_picture: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_admin: {  
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
});

module.exports = User;
