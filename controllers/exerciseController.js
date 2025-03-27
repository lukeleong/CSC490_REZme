exports.getExercisesByBodyPart = async (req, res) => {
    try {
        const { bodyPart } = req.params;
        const API_URL = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10&offset=0`;

        console.log(`Fetching exercises for body part: ${bodyPart}`);

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "exercisedb.p.rapidapi.com",
                "x-rapidapi-key": "2bc91b2016msh93b040a88587a17p1d2e18jsn1bee8209e531", 
            },
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ExerciseDB API Error Response:", errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        console.log("ExerciseDB API Data:", data);
        res.json(data);
    } catch (error) {
        console.error("Error fetching exercises:", error.message);
        res.status(500).json({ error: "Failed to fetch exercises", details: error.message });
    }
};