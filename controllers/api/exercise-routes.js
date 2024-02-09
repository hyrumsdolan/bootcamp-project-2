const express = require('express');
const router = express.Router();
const request = require('request-promise');
const asyncHandler = require('express-async-handler');
const { Set, User, Workout } = require('../../models');

router.get('/getWorkout', asyncHandler(async (req, res) => { // Query = /api/exercise/getWorkout?muscle=legs
  const muscle = req.query.muscle || 'legs';

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
        if (response && response.length > 0) {
          const workout = response[0];
          const [dbWorkout, created] = await Workout.findOrCreate({
            where: { name: workout.name },
            defaults: {
              name: workout.name,
              muscle: m,
              instructions: workout.instructions, 
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


  router.post('/logSets', asyncHandler(async (req, res) => { // Query = /api/exercise/logSets/
    const { workout_name, sets } = req.body;
    const user_id = req.session.user_id;
  
    const workout = await Workout.findOne({
      where: { name: workout_name }
    });

    if (!workout) {
      return res.status(404).send('Workout not found');
    }

    const workoutExists = workout !== null;
    const workout_id = workout.id; 
  
    const userExists = await User.findByPk(user_id);
 
    if (!userExists) {
      return res.status(404).send('User not found');
    }
  
    try {
      const createdSets = await Set.bulkCreate(
        sets.map(set => ({
          ...set,
          workout_id, 
          user_id,
        }))
      );
      res.json(createdSets);
    } catch (error) {
      console.error('Error logging sets:', error);
      res.status(500).send('Error logging sets');
    }
  }));


  router.get('/getSets/:workoutName', asyncHandler(async (req, res) => {
    const { workoutName } = req.params;
    const userId = req.session.user_id;
  
    if (!userId) {
        return res.status(400).send('UserId is required');
    }
  
    try {
        // Find the workout details including the instructions
        const workout = await Workout.findOne({
            where: { name: workoutName }
        });
  
        if (!workout) {
            return res.status(404).send('Workout not found');
        }
  
        // Fetch the last 5 sets based on the highest set IDs
        const sets = await Set.findAll({
            where: {
                workout_id: workout.id,
                user_id: userId
            },
            order: [['id', 'DESC']], // Order by 'id' in descending order
            limit: 5 // Limits the result to the last 5 sets
        });
  
        // Combine the workout details with the sets information
        const responsePayload = {
            workoutDetails: {
                id: workout.id,
                name: workout.name,
                instructions: workout.instructions,
            },
            sets: sets.reverse() // Reverse to ensure the sets are returned in ascending order
        };
  
        res.json(responsePayload);
    } catch (error) {
        console.error('Error retrieving sets and workout details:', error);
        res.status(500).send('Error retrieving sets and workout details');
    }
}));



  router.get('/workoutDetails/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByPk(id);
    if (workout) {
        res.json(workout);
    } else {
        res.status(404).send('Workout not found');
    }
}));

  

module.exports = router;
