const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  UserId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  TermsAgreed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  LastName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  DateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  UnitPreference: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  RegistrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  LastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ProfilePicture: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  googleId: {  
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,  
  },
  resetToken: { 
    type: DataTypes.STRING, 
    allowNull: true },

  resetTokenExpiry: { 
    type: DataTypes.DATE, 
    allowNull: true }

});

module.exports = User;
