const express = require('express');
const router = express.Router();
const request = require('request-promise'); // Switched to 'request-promise' for easier async handling
const asyncHandler = require('express-async-handler'); // For handling asynchronous routes

// Define your route using asyncHandler for async error handling
router.get('/getWorkout', asyncHandler(async (req, res) => {
  const muscle = req.query.muscle || 'legs'; // Default to 'biceps' if not specified

  // Define muscle groups for pull, push, and legs
  const muscleGroups = {
    pull: ['biceps', 'forearms', 'lats', 'middle_back', 'traps'],
    push: ['chest', 'shoulders', 'triceps'],
    legs: ['calves', 'glutes', 'hamstrings', 'quadriceps']
  };

  const randomWorkouts = [];

  if (['pull', 'push', 'legs'].includes(muscle.toLowerCase())) {
    // Fetch workouts for each muscle in the group
    for (const m of muscleGroups[muscle.toLowerCase()]) {
      const options = {
        url: `https://api.api-ninjas.com/v1/exercises?muscle=${m}`,
        headers: {
          'X-Api-Key': process.env.API_KEY // Ensure you have your API key here
        },
        json: true // Automatically parses the JSON string in the response
      };

      try {
        const response = await request.get(options);
        if (response && response.length > 0) {
          // Pick a random workout from the response
          const randomIndex = Math.floor(Math.random() * response.length);
          randomWorkouts.push(response[randomIndex]);
        }
      } catch (error) {
        console.error(`Failed to fetch workouts for muscle ${m}:`, error);
        // Optionally handle errors, e.g., continue to the next muscle or send an error response
      }
    }

    // Send the selected random workouts back
    res.json(randomWorkouts);
  } else {
    // If the muscle doesn't match "pull", "push", or "legs", handle it accordingly
    res.status(400).send('Invalid muscle group specified');
  }
}));

module.exports = router;
