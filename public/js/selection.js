const legsBtn = document.getElementById("legs-btn");
const pushBtn = document.getElementById("push-btn");
const pullBtn = document.getElementById("pull-btn");
const finishWorkoutBtn = document.getElementById("finish-workout-btn");
const restartBtn = document.getElementById("restart-btn");
const finishSetsBtn = document.getElementById("finish-sets-btn");

let workoutObject;
let currentWorkout;

document.addEventListener("DOMContentLoaded", () => {
  setEventListeners();
});

async function getWorkout(muscleGroup) {
    let muscleText = muscleGroup;

    // Capitalize the first letter and remove the 's' from "legs" if needed
    muscleText = muscleGroup.charAt(0).toUpperCase() + (muscleGroup === "legs" ? muscleGroup.slice(1, -1) : muscleGroup.slice(1));
    
    document.getElementById("workout-list-header").innerHTML = `<h2> It's ${muscleText} Day </h2>`;
    

  try {
    const response = await fetch(`/api/exercise/getWorkout?muscle=${muscleGroup}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const workouts = await response.json();
      workoutObject = workouts.details;
      console.log("Fetch successful", workoutObject);
      updateWorkoutList(workoutObject);
    } else {
      console.error("Fetch unsuccessful");
      alert("Failed to fetch workouts");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function navigateFromSelectionToFullWorkout() {
  document.querySelector("#selection-modal-hide").classList.add("hide");
  document.querySelector("#full-workout-modal").classList.remove("hide");
}

function updateWorkoutList(workouts) {
  const workoutList = document.getElementById("workout-list");
  // Clear existing workout list
  workoutList.innerHTML = "";

  // Dynamically create and append workout items
  workouts.forEach((workout) => {
    const exerciseDiv = document.createElement("div");
    exerciseDiv.className = "exercise";
    exerciseDiv.innerHTML = `<p>${workout.name}</p>`;
    exerciseDiv.dataset.exerciseId = workout.id;

    exerciseDiv.addEventListener("click", () => {
      currentWorkout = workout.name;
      navigateFromTo("#full-workout-modal", "#single-workout-modal");
      let singleWorkoutNameDisplay = document.querySelector(".exercise-description h2");
      let singleWorkoutInstruction = document.querySelector(".exercise-description p");
      singleWorkoutNameDisplay.textContent = workout.name;

      // Truncate instructions to 200 characters followed by ellipses if longer
      let instructionsPreview = workout.instructions.length > 200 ? workout.instructions.substring(0, 200) + "..." : workout.instructions;
      singleWorkoutInstruction.textContent = instructionsPreview;

      // Store full instructions for use in modal
      singleWorkoutInstruction.dataset.fullInstructions = workout.instructions;
      document.getElementById("single-workout-modal").dataset.currentExerciseId = workout.id;

      getSets(workout.name);
    });

    workoutList.appendChild(exerciseDiv);
  });
}

function navigateFromTo(hideMe, showMe) {
  document.querySelector(hideMe).classList.add("hide");
  document.querySelector(showMe).classList.remove("hide");
}

function setEventListeners() {
    // Selection Page Options
    legsBtn.addEventListener("click", () => {
      getWorkout("legs");
      navigateFromSelectionToFullWorkout();
    });
    pullBtn.addEventListener("click", () => {
      getWorkout("pull");
      navigateFromSelectionToFullWorkout();
    });
    pushBtn.addEventListener("click", () => {
      getWorkout("push");
      navigateFromSelectionToFullWorkout();
    });
  
    //Button Navigations
    finishWorkoutBtn.addEventListener("click", () => {
      navigateFromTo("#full-workout-modal", "#completed-workout-modal");

    });
  
    restartBtn.addEventListener("click", () => {
      navigateFromTo("#completed-workout-modal", "#selection-modal-hide"); // Adjusted to go back to the selection screen
    });
  
    finishSetsBtn.addEventListener("click", () => {
      navigateFromTo("#single-workout-modal", "#full-workout-modal");
      logSets();
    });
  
    // This listener is now outside and directly accessible after DOM is loaded.
    document.querySelector("#instructions-btn").addEventListener("click", () => {
      // Retrieve full instructions from the dataset or variable
      let fullInstructions = document.querySelector(".exercise-description p").dataset.fullInstructions;
  
      // Set the full instructions in the modal
      document.getElementById("full-instructions").textContent = fullInstructions;
  
      // Show the instructions modal
      document.getElementById("instructions-modal").style.display = "block";

    });
  
    document.querySelector(".close").addEventListener("click", () => {
        document.getElementById("instructions-modal").style.display = "none";

    });
  }
  
  async function logSets() {
    const sets = [];
    const setDivs = document.querySelectorAll(".sets .set"); // Select all set divs

    setDivs.forEach((setDiv) => {
        // Use querySelector within setDiv to find inputs specifically within this div
        const weightInput = setDiv.querySelector('.weight').value;
        const repsInput = setDiv.querySelector('.reps').value;

        // Push an object with weight and reps into the sets array
        // Ensure to convert values to the correct type (e.g., Number) if necessary
        sets.push({
            weight: Number(weightInput), // Convert string to number
            reps: Number(repsInput), // Convert string to number
        });
    });

    try {
        const response = await fetch("/api/exercise/logSets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                workout_name: currentWorkout,
                sets, // This should now contain all the set data
            }),
        });

        if (response.ok) {
            const loggedSets = await response.json();
            console.log("Sets logged successfully", loggedSets);
        } else {
            console.error("Sets log unsuccessful");
            alert("Failed to log sets");
        }
    } catch (error) {
        console.error("Sets log error:", error);
    }
}


  async function getSets(workoutName) {
    try {
      const response = await fetch(`/api/exercise/getSets/${workoutName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        const { workoutDetails, sets } = await response.json();
        console.log("Fetch successful", workoutDetails, sets);
  

        sets.forEach((set, index) => {

          let setDiv = document.getElementById(`set${index + 1}`);
        
          // Populate the set's input fields
          const repsInput = setDiv.querySelector(".last1");
          const weightInput = setDiv.querySelector(".last2");
          repsInput.textContent = "last: "+set.reps;
          weightInput.textContent = "last: "+set.weight;
          if (!set.reps) {
            repsInput.value = 0
          }
          if (!set.weight) {
            weightInput.value = 0
          }
        });
  
        
          }
        } catch (error) {
        console.error("Fetch error:", error);
    
  }
}
  