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
                // Here you can call a function to handle displaying the workouts
                // For example: displayWorkouts(workouts);
            } else {
                console.error("Fetch unsuccessful");
                alert('Failed to fetch workouts');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
});
