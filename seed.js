const { sequelize, User, Injury, RecoveryPlan, Exercise, ExerciseCompletion } = require('./models');

async function seed() {
  try {
    // Disable foreign key checks
    await sequelize.query("PRAGMA foreign_keys = OFF;");
    
    // Force-sync the database (drops tables if they exist)
    await sequelize.sync({ force: true });
    console.log("Database synced");

    // Re-enable foreign key checks
    await sequelize.query("PRAGMA foreign_keys = ON;");

    // --- Seed Users ---
    const user1 = await User.create({
      Email: 'john@example.com',
      Password: 'password123',
      TermsAgreed: true,
      FirstName: 'John',
      LastName: 'Doe'
    });
    const user2 = await User.create({
      Email: 'jane@example.com',
      Password: 'password456',
      TermsAgreed: true,
      FirstName: 'Jane',
      LastName: 'Doe'
    });

    // --- Seed Injuries ---
    const injury1 = await Injury.create({
      UserId: user1.UserId,
      InjuryType: 'Sprain',
      InjuryLocation: 'Ankle',
      InjurySeverity: 4,
      PainLevel: 6,
      MobilityLevel: 7,
      StartDate: new Date('2023-01-01'),
      LastUpdate: new Date(),
      IsActive: true
    });

    const injury2 = await Injury.create({
      UserId: user2.UserId,
      InjuryType: 'Fracture',
      InjuryLocation: 'Arm',
      InjurySeverity: 8,
      PainLevel: 8,
      MobilityLevel: 4,
      StartDate: new Date('2023-02-01'),
      LastUpdate: new Date(),
      IsActive: true
    });

    // --- Seed Recovery Plans ---
    const recoveryPlan1 = await RecoveryPlan.create({
      UserId: user1.UserId,
      InjuryId: injury1.InjuryId,
      StartDate: new Date('2023-01-05'),
      EndDate: new Date('2023-03-05'),
      ProgressStatus: 50,
      LastUpdate: new Date(),
      ProgressFeedback: 'Making steady progress',
      IsActive: true
    });

    const recoveryPlan2 = await RecoveryPlan.create({
      UserId: user2.UserId,
      InjuryId: injury2.InjuryId,
      StartDate: new Date('2023-02-05'),
      EndDate: null,
      ProgressStatus: 20,
      LastUpdate: new Date(),
      ProgressFeedback: 'Just starting out',
      IsActive: true
    });

    // --- Seed Exercises ---
    const exercise1 = await Exercise.create({
      ExerciseName: 'Ankle Flexibility',
      InjuryId: injury1.InjuryId,
      Difficulty: 3,
      VideoGuide: 'http://example.com/ankle-flexibility.mp4',
      ExerciseImage: 'http://example.com/ankle.jpg'
    });

    const exercise2 = await Exercise.create({
      ExerciseName: 'Arm Strengthening',
      InjuryId: injury2.InjuryId,
      Difficulty: 4,
      VideoGuide: 'http://example.com/arm-strength.mp4',
      ExerciseImage: 'http://example.com/arm.jpg'
    });

    // --- Seed Exercise Completions ---
    await ExerciseCompletion.create({
      PlanId: recoveryPlan1.PlanId,
      ExerciseId: exercise1.ExerciseId,
      SetsCompleted: 3,
      RepsCompleted: 10,
      TimeTaken: 600,
      PostPainLevel: 3,
      PostMobilityLevel: 7,
      DifficultyRating: 2,
      ProgressValue: 0.75,
      ProgressFeedback: 'Good session with slight discomfort',
      ModifiedAt: new Date()
    });

    await ExerciseCompletion.create({
      PlanId: recoveryPlan2.PlanId,
      ExerciseId: exercise2.ExerciseId,
      SetsCompleted: 2,
      RepsCompleted: 8,
      TimeTaken: 500,
      PostPainLevel: 5,
      PostMobilityLevel: 5,
      DifficultyRating: 3,
      ProgressValue: 0.5,
      ProgressFeedback: 'Challenging exercise, needs adjustment',
      ModifiedAt: new Date()
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
