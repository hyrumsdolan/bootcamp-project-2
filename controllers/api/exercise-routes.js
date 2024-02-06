const express = require('express');
const router = express.Router();
const request = require('request-promise'); // Switched to 'request-promise' for easier async handling
const asyncHandler = require('express-async-handler'); // For handling asynchronous routes
const { Set, User, Workout } = require('../../models');


// Define your route using asyncHandler for async error handling
router.get('/getWorkout', asyncHandler(async (req, res) => {
  const muscle = req.query.muscle || 'legs'; // Default muscle group

  const muscleGroups = {
    pull: ['biceps', 'forearms', 'lats', 'middle_back', 'traps'],
    push: ['chest', 'shoulders', 'triceps'],
    legs: ['calves', 'glutes', 'hamstrings', 'quadriceps']
  };

  const processedWorkouts = [];

  if (['pull', 'push', 'legs'].includes(muscle.toLowerCase())) {
    for (const m of muscleGroups[muscle.toLowerCase()]) {
      const options = {
        url: `https://api.api-ninjas.com/v1/exercises?muscle=${m}`,
        headers: { 'X-Api-Key': process.env.API_KEY },
        json: true
      };

      try {
        const response = await request.get(options);
        for (const workout of response) {
          // Use findOrCreate to check if the workout exists and add it if not
          const [dbWorkout, created] = await Workout.findOrCreate({
            where: { name: workout.name },
            defaults: {
              name: workout.name,
              muscle: m // Assuming your model includes a 'muscle' field
              // Add other fields as needed
            }
          });

          if (created) {
            processedWorkouts.push({ ...workout, status: 'Added' });
          } else {
            processedWorkouts.push({ ...workout, status: 'Already exists' });
          }
        }
      } catch (error) {
        console.error(`Failed to fetch workouts for muscle ${m}:`, error);
        return res.status(500).send(`Failed to process workouts for muscle group: ${m}`);
      }
    }

    res.json({
      message: 'Workouts processed.',
      details: processedWorkouts
    });
  } else {
    res.status(400).send('Invalid muscle group specified');
  }
}));


// POST route to log sets for a workout
router.post('/logSets', asyncHandler(async (req, res) => {
  const { workout_id, user_id, sets } = req.body; // Now expecting `user_id` in the request

  // Check if the workout exists
  const workoutExists = await Workout.findByPk(workout_id);
  if (!workoutExists) {
    return res.status(404).send('Workout not found');
  }

  // Optionally, check if the user exists as well
  const userExists = await User.findByPk(user_id);
  if (!userExists) {
    return res.status(404).send('User not found');
  }

  try {
    const createdSets = await Set.bulkCreate(
      sets.map(set => ({
        ...set,
        workout_id, // Add workout_id to each set
        user_id, // Add user_id to each set, ensuring it's included in the database insert
      }))
    );
    res.json(createdSets);
  } catch (error) {
    console.error('Error logging sets:', error);
    res.status(500).send('Error logging sets');
  }
}));





// GET route to retrieve sets for a workout
router.get('/getSets/:workoutId', asyncHandler(async (req, res) => {
  const { workoutId } = req.params; // Extract workoutId from URL params
  const userId = req.query.userId; // Assume userId is provided as a query parameter

  // Validate userId presence
  if (!userId) {
    return res.status(400).send('UserId is required');
  }

  try {
    const sets = await Set.findAll({
      where: {
        workout_id: workoutId,
        user_id: userId // Add user_id to the where clause
      },
      include: [
        {
          model: Workout,
          attributes: ['name'], // Include workout name
        },
        {
          model: User, // Include user details
          attributes: ['name', 'email'], // Adjust attributes as needed
        }
      ]
    });
    res.json(sets);
  } catch (error) {
    console.error('Error retrieving sets:', error);
    res.status(500).send('Error retrieving sets');
  }
}));






module.exports = router;
