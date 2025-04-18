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
        VideoGuide: "https://youtu.be/vHMJ0zgrsFU?si=McWqbRUjwCeGdpFY",
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
        VideoGuide: "https://www.youtube.com/watch?v=nBNPTxZoRUo&pp=ygUMaGVlbCB3YWxraW5n",
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
        VideoGuide: "https://www.youtube.com/watch?v=XEJYq1HBtHY&pp=ygUOdG93ZWwgc2NydW5oZXM%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=Dtgh2_LFkBQ&pp=ygUSc2luZ2xlIGxlZyBiYWxhbmNl",
        Difficulty: 2,
        Instruction: "Stand on one foot and try to maintain balance for 30 seconds. Switch sides.",
        Public: false
      },
      {
        ExerciseName: "Ankle Circles",
        TargetMuscleGroup: "ankle",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://www.youtube.com/watch?v=Za8PFXDFp_M&pp=ygUNYW5rbGUgY2lyY2xlcw%3D%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=DnPpm_VKqhI&pp=ygUQaGVlbCB0byB0b2Ugd2xhaw%3D%3D",
        Instruction: "Walk in a straight line, placing the heel of one foot directly in front of the toes of the other.",
        Public: false
      },
      {
        ExerciseName: "Resistance Band Plantarflexion",
        TargetMuscleGroup: "ankle",
        Equipment: "resistance band",
        Difficulty: 2,
        VideoGuide: "https://www.youtube.com/watch?v=9bdOZ-1usoM&pp=ygUfUmVzaXN0YW5jZSBCYW5kIFBsYW50YXJmbGV4aW9uIg%3D%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=tOplbmmW2Rg&pp=ygUKc3RlcCBkb3ducw%3D%3D",
        Instruction: "Stand on a low step and slowly lower one foot to the floor while keeping balance.",
        Public: false
      },
      {
        ExerciseName: "Toe Taps",
        TargetMuscleGroup: "ankle",
        Equipment: "step",
        Difficulty: 1,
        VideoGuide: "https://www.youtube.com/watch?v=A5H4t2ZMos8&pp=ygUIdG9lIHRhcHM%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=HtMI17DGuTk&pp=ygURYmlyZCBkb2cgZXhlcmNpc2U%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=vuyUwtHl694&pp=ygUPY2F0IGNvdyBzdHJldGNo",
        Public: false
      },

      // --- UPPER BACK ---
      {
        ExerciseName: "Wall Angels",
        TargetMuscleGroup: "upper back",
        Equipment: "wall",
        Difficulty: 2,
        VideoGuide: "https://www.youtube.com/watch?v=1UU4VvklQ44&pp=ygULd2FsbCBhbmdlbHM%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=LSkyinhmA8k&pp=ygUUcmVzaXN0bmFjZSBiYW5kIHJvd3M%3D",
        Instruction: "Pull band handles toward you while keeping elbows tucked.",
        Public: false
      },

      // --- SHOULDERS ---
      {
        ExerciseName: "Shoulder Circles",
        TargetMuscleGroup: "shoulders",
        Equipment: "body weight",
        Difficulty: 1,
        VideoGuide: "https://www.youtube.com/watch?v=jDbfuzfdVHM&pp=ygUPc2hvdWxkZXIgY2lyY2xz",
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
        VideoGuide: "https://www.youtube.com/watch?v=B-aVuyhvLHU&pp=ygUWZHVtYmVsbCBzaG91bGRlciBwcmVzcw%3D%3D",
        Instruction: "Press dumbbells overhead while seated or standing.",
        Public: false
      },

      // --- CHEST ---
      {
        ExerciseName: "Wall Push-ups",
        TargetMuscleGroup: "chest",
        Equipment: "wall",
        Difficulty: 1,
        VideoGuide: "https://www.youtube.com/watch?v=YB0egDzsu18&pp=ygUMd2FsbCBwdXNodXBz",
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
        VideoGuide: "https://www.youtube.com/watch?v=2z8JmcrWAs0&pp=ygUQSW5jbGluZSBwdXNodXBz",
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
        VideoGuide: "https://www.youtube.com/watch?v=3g-1J2KkX_8&pp=ygURYmljZXAgY3VybHMgIGJhbmTSBwkJfgkBhyohjO8%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=6kALZikXxLc&pp=ygUQdHJpY3BzIGRpcHMgY2hhaXI%3D",
        Instruction: "Lower and raise body using arms while hands rest on chair edge.",
        Public: false
      },

      // --- CORE ---
      {
        ExerciseName: "Plank Hold",
        TargetMuscleGroup: "core",
        Equipment: "body weight",
        Difficulty: 2,
        VideoGuide: "https://www.youtube.com/watch?v=pvIjsG5Svck&t=2s&pp=ygUKcGxhbmsgaG9sZA%3D%3D",
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
        VideoGuide: "https://www.youtube.com/watch?v=4q2cZ2bF8X0&pp=ygUQZGVhZCBidWcgZXhlcmNpc2U%3D",
        Instruction: "Alternate extending opposite arm and leg while on back.",
        Public: false
      },

      // --- QUADS ---
      {
        ExerciseName: "Wall Sit",
        TargetMuscleGroup: "quads",
        Equipment: "wall",
        Difficulty: 2,
        VideoGuide: "https://www.youtube.com/watch?v=cWTZ8Am1Ee0&pp=ygUHd2FsbHNpdNIHCQl-CQGHKiGM7w%3D%3D",
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
