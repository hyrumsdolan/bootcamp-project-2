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
              muscle: m
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


router.get('/getSets/:workoutId', asyncHandler(async (req, res) => { // Query = /api/exercise/getSets/1
  const { workoutId } = req.params;
  const userId = req.session.user_id;

  if (!userId) {
    return res.status(400).send('UserId is required');
  }

  try {
    const sets = await Set.findAll({
      where: {
        workout_id: workoutId,
        user_id: userId
      },
      include: [
        {
          model: Workout,
          attributes: ['name'],
        },
        {
          model: User,
          attributes: ['name', 'email'],
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
