const { ExerciseRating } = require("../models");

// POST /api/exercise-ratings
exports.createRating = async (req, res) => {
    const { userId, exerciseId, Rating, Comment } = req.body;
  
    console.log("Incoming rating POST payload:", {
      userId,
      exerciseId,
      Rating,
      Comment
    });
  
    if (!userId || !exerciseId || Rating == null) {
      return res.status(400).json({ error: "Missing required fields." });
    }
  
    try {
      const newRating = await ExerciseRating.create({
        UserId: userId,
        ExerciseId: exerciseId,
        Rating,
        Comment
      });
  
      res.status(201).json(newRating);
    } catch (err) {
      console.error("Error creating rating:", err);
      res.status(500).json({ error: "Failed to create rating." });
    }
  };

// GET /api/exercise-ratings/:exerciseId
exports.getRatingsForExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;

        const ratings = await ExerciseRating.findAll({
            where: { ExerciseId: exerciseId },
            include: [{ model: require("../models").User, attributes: ["FirstName", "LastName"] }]
        });

        res.json(ratings);
    } catch (err) {
        console.error("Error fetching ratings:", err);
        res.status(500).json({ error: "Failed to fetch ratings." });
    }
};

// PUT /api/exercise-ratings/:exerciseId/:userId
exports.updateRating = async (req, res) => {
    try {
        const { exerciseId, userId } = req.params;
        const { Rating, Comment } = req.body;

        const ratingEntry = await ExerciseRating.findOne({
            where: { ExerciseId: exerciseId, UserId: userId },
        });

        if (!ratingEntry) {
            return res.status(404).json({ error: "Rating not found for this user and exercise." });
        }

        ratingEntry.Rating = Rating ?? ratingEntry.Rating;
        ratingEntry.Comment = Comment ?? ratingEntry.Comment;

        await ratingEntry.save();

        res.status(200).json({ message: "Rating updated successfully.", rating: ratingEntry });
    } catch (err) {
        console.error("Error updating rating:", err);
        res.status(500).json({ error: "Failed to update rating." });
    }
};

