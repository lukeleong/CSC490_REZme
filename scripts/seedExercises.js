const { sequelize, Exercise } = require("../models");

const seedExercises = async () => {
  try {
    await sequelize.sync();
    await Exercise.destroy({ where: {} });
    console.log("Cleared existing exercises");

    const exercises = [
      // --- ANKLE ---
      {
        ExerciseName: "Ankle Alphabet",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://example.com/ankle-alphabet",
        Sets: 2,
        Reps: 10,
        TargetTime: 60,
        RestTime: 30,
        Instruction: "Draw the alphabet in the air with your toes while seated.",
        Public: true
      },
      {
        ExerciseName: "Heel Walking",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/heel-walking",
        Sets: 2,
        Reps: null,
        TargetTime: 120,
        RestTime: 60,
        Instruction: "Walk forward on your heels keeping toes off the ground.",
        Public: false
      },
      {
        ExerciseName: "Towel Scrunches",
        TargetMuscleGroup: "ankle",
        Equipment: "towel",
        Difficulty: 1,
        VideoGuide: "https://example.com/towel-scrunches",
        Sets: 3,
        Reps: 15,
        TargetTime: 45,
        RestTime: 30,
        Instruction: "Use your toes to scrunch and pull a towel toward you while seated.",
        Public: true
      },
      {
        ExerciseName: "Single Leg Balance",
        TargetMuscleGroup: "ankle",
        Equipment: null,
        Difficulty: 2,
        Instruction: "Stand on one foot and try to maintain balance for 30 seconds. Switch sides.",
        Public: false
      },
      {
        ExerciseName: "Ankle Circles",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://example.com/ankle-circles",
        Sets: 2,
        Reps: 20,
        TargetTime: 60,
        RestTime: 30,
        Instruction: "Slowly rotate your ankle clockwise and counterclockwise while seated or lying down.",
        Public: true
      },
      {
        ExerciseName: "Heel-to-Toe Walk",
        TargetMuscleGroup: "ankle",
        Equipment: null,
        Difficulty: 2,
        Instruction: "Walk in a straight line, placing the heel of one foot directly in front of the toes of the other.",
        Public: false
      },
      {
        ExerciseName: "Resistance Band Plantarflexion",
        TargetMuscleGroup: "ankle",
        Equipment: "resistance band",
        Difficulty: 2,
        VideoGuide: "https://example.com/plantarflexion-band",
        Sets: 3,
        Reps: 12,
        TargetTime: 45,
        RestTime: 45,
        Instruction: "Push your foot downward against the band’s resistance while seated.",
        Public: true
      },
      {
        ExerciseName: "Step-Downs",
        TargetMuscleGroup: "ankle",
        Equipment: "step or platform",
        Difficulty: 2,
        Instruction: "Stand on a low step and slowly lower one foot to the floor while keeping balance.",
        Public: false
      },
      {
        ExerciseName: "Toe Taps",
        TargetMuscleGroup: "ankle",
        Equipment: "step",
        Difficulty: 1,
        VideoGuide: "https://example.com/toe-taps",
        Sets: 3,
        Reps: 20,
        TargetTime: 60,
        RestTime: 30,
        Instruction: "Alternate tapping the top of a step or platform with your toes as quickly as controlled.",
        Public: true
      },
      
      // --- LOWER BACK ---
      {
        ExerciseName: "Bird Dog",
        TargetMuscleGroup: "lower back",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/bird-dog",
        Sets: 3,
        Reps: 12,
        TargetTime: 60,
        RestTime: 45,
        Instruction: "Extend opposite arm and leg while maintaining a stable core.",
        Public: true
      },
      {
        ExerciseName: "Cat-Cow Stretch",
        TargetMuscleGroup: "lower back",
        Instruction: "Arch and round your back slowly while on all fours.",
        Public: false
      },

      // --- UPPER BACK ---
      {
        ExerciseName: "Wall Angels",
        TargetMuscleGroup: "upper back",
        Equipment: "wall",
        Difficulty: 2,
        VideoGuide: "https://example.com/wall-angels",
        Sets: 3,
        Reps: 15,
        TargetTime: 90,
        RestTime: 30,
        Instruction: "Slide arms up and down a wall while maintaining contact.",
        Public: true
      },
      {
        ExerciseName: "Resistance Band Rows",
        TargetMuscleGroup: "upper back",
        Equipment: "resistance band",
        Difficulty: 3,
        Instruction: "Pull band handles toward you while keeping elbows tucked.",
        Public: false
      },

      // --- SHOULDERS ---
      {
        ExerciseName: "Shoulder Circles",
        TargetMuscleGroup: "shoulders",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://example.com/shoulder-circles",
        Sets: 2,
        Reps: 20,
        TargetTime: 60,
        RestTime: 30,
        Instruction: "Perform slow, controlled shoulder rotations forward and backward.",
        Public: true
      },
      {
        ExerciseName: "Dumbbell Shoulder Press",
        TargetMuscleGroup: "shoulders",
        Equipment: "dumbbells",
        Difficulty: 3,
        Instruction: "Press dumbbells overhead while seated or standing.",
        Public: false
      },

      // --- CHEST ---
      {
        ExerciseName: "Wall Push-ups",
        TargetMuscleGroup: "chest",
        Equipment: "wall",
        Difficulty: 1,
        VideoGuide: "https://example.com/wall-pushups",
        Sets: 3,
        Reps: 15,
        TargetTime: 60,
        RestTime: 30,
        Instruction: "Stand arm’s length from wall and perform push-ups against it.",
        Public: true
      },
      {
        ExerciseName: "Incline Push-ups",
        TargetMuscleGroup: "chest",
        Equipment: "bench",
        Difficulty: 2,
        Instruction: "Place hands on elevated surface and perform controlled push-ups.",
        Public: false
      },

      // --- ARMS ---
      {
        ExerciseName: "Bicep Curls",
        TargetMuscleGroup: "arms",
        Equipment: "resistance band",
        Difficulty: 2,
        VideoGuide: "https://example.com/bicep-curls-band",
        Sets: 3,
        Reps: 15,
        TargetTime: 60,
        RestTime: 45,
        Instruction: "Stand on band and curl handles toward shoulders.",
        Public: true
      },
      {
        ExerciseName: "Triceps Dips on Chair",
        TargetMuscleGroup: "arms",
        Equipment: "chair",
        Difficulty: 3,
        Instruction: "Lower and raise body using arms while hands rest on chair edge.",
        Public: false
      },

      // --- CORE ---
      {
        ExerciseName: "Plank Hold",
        TargetMuscleGroup: "core",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://example.com/plank-hold",
        Sets: 3,
        Reps: null,
        TargetTime: 90,
        RestTime: 60,
        Instruction: "Hold a plank position with elbows under shoulders.",
        Public: true
      },
      {
        ExerciseName: "Dead Bug",
        TargetMuscleGroup: "core",
        Equipment: "body weight",
        Difficulty: 2,
        Instruction: "Alternate extending opposite arm and leg while on back.",
        Public: false
      },

      // --- QUADS ---
      {
        ExerciseName: "Wall Sit",
        TargetMuscleGroup: "quads",
        Equipment: "wall",
        Difficulty: 2,
        VideoGuide: "https://example.com/wall-sit",
        Sets: 3,
        Reps: null,
        TargetTime: 60,
        RestTime: 45,
        Instruction: "Hold a seated position against a wall with thighs parallel to the floor.",
        Public: true
      },
      {
        ExerciseName: "Bodyweight Squats",
        TargetMuscleGroup: "quads",
        Instruction: "Perform squats slowly with bodyweight, keeping heels grounded.",
        Public: false
      }
    ];

    await Exercise.bulkCreate(exercises);
    console.log("Exercises seeded successfully");
  } catch (err) {
    console.error("Failed to seed exercises:", err);
  }
};

seedExercises();
