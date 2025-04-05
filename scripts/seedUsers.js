// scripts/seedUsers.js
// run with: node scripts/seedUsers.js
const { sequelize, User } = require("../models");

const seedUsers = async () => {
  try {
    await sequelize.sync(); // Ensure table exists

    // Clear existing data
    await User.destroy({ where: {} });
    console.log("Cleared existing users");

    const now = new Date();

    const users = [
      {
        Email: "alice@example.com",
        Password: "hashedpassword1",
        TermsAgreed: 1,
        FirstName: "Alice",
        LastName: "Smith",
        DateOfBirth: new Date("1995-06-01"),
        UnitPreference: "metric",
        RegistrationDate: now,
        LastLogin: now,
        ProfilePicture: null,
        IsAdmin: 0,
        googleId: null,
        createdAt: now,
        updatedAt: now
      },
      {
        Email: "bob@example.com",
        Password: "hashedpassword2",
        TermsAgreed: 1,
        FirstName: "Bob",
        LastName: "Johnson",
        DateOfBirth: new Date("1990-03-14"),
        UnitPreference: "imperial",
        RegistrationDate: now,
        LastLogin: now,
        ProfilePicture: null,
        IsAdmin: 0,
        googleId: null,
        createdAt: now,
        updatedAt: now
      },
      {
        Email: "carol@example.com",
        Password: "hashedpassword3",
        TermsAgreed: 1,
        FirstName: "Carol",
        LastName: "Lee",
        DateOfBirth: new Date("1988-11-22"),
        UnitPreference: "metric",
        RegistrationDate: now,
        LastLogin: now,
        ProfilePicture: null,
        IsAdmin: 0,
        googleId: null,
        createdAt: now,
        updatedAt: now
      },
      {
        Email: "dan@example.com",
        Password: "hashedpassword4",
        TermsAgreed: 1,
        FirstName: "Dan",
        LastName: "Wong",
        DateOfBirth: new Date("2000-01-10"),
        UnitPreference: "imperial",
        RegistrationDate: now,
        LastLogin: now,
        ProfilePicture: null,
        IsAdmin: 0,
        googleId: null,
        createdAt: now,
        updatedAt: now
      }
    ];

    await User.bulkCreate(users);
    console.log("Users seeded successfully");
  } catch (err) {
    console.error("Failed to seed users:", err);
  } finally {
    //await sequelize.close();
  }
};

seedUsers();
