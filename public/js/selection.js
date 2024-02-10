document.addEventListener('DOMContentLoaded', () => {
    const startWorkoutBtn = document.getElementById('start-workout-btn');

    startWorkoutBtn.addEventListener('click', async function() {
        const muscleGroup = document.getElementById('workout-type-selector').value;
        
        try {
            const response = await fetch(`/api/exercise/getWorkout?muscle=${muscleGroup}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const workouts = await response.json();
                console.log("Fetch successful", workouts);
            
            } else {
                console.error("Fetch unsuccessful");
                alert('Failed to fetch workouts');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
});

document.querySelector('#start-workout-btn').addEventListener('click', () => {
    document.querySelector('#selection-modal-hide').classList.add('hide');
    document.querySelector('#full-workout-modal').classList.remove('hide');
  });

  document.querySelector('#finish-workout-btn').addEventListener('click', () => {
    document.querySelector('#full-workout-modal').classList.add('hide');
    document.querySelector('#completed-workout-modal').classList.remove('hide');
  });

  document.querySelector('#restart-btn').addEventListener('click', () => {
    document.querySelector('#completed-workout-modal').classList.add('hide');
    document.querySelector('#single-workout-modal').classList.remove('hide');
  });

  document.querySelector('#finish-sets-btn').addEventListener('click', () => {
    document.querySelector('#single-workout-modal').classList.add('hide');
    document.querySelector('#full-workout-modal').classList.remove('hide');
  });