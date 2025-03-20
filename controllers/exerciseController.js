const axios = require("axios");

// ExerciseDB API configuration
const EXERCISE_DB_URL = "https://exercisedb.p.rapidapi.com/exercises/bodyPart/";
const API_KEY = "2bc91b2016msh93b040a88587a17p1d2e18jsn1bee8209e531";

// Fetch exercises for a specific body part
exports.getExercisesByBodyPart = async (req, res) => {
    try {
        const { bodyPart } = req.params;

        const options = {
            method: "GET",
            url: `${EXERCISE_DB_URL}${bodyPart}`,
            headers: {
                "X-RapidAPI-Key": API_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
        };

        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching exercises:", error);
        res.status(500).json({ error: "Failed to fetch exercises" });
    }
};
