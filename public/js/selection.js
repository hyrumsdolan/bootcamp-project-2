const legsBtn = document.getElementById("legs-btn");
const pushBtn = document.getElementById("push-btn");
const pullBtn = document.getElementById("pull-btn");
const finishWorkoutBtn = document.getElementById("finish-workout-btn");
const restartBtn = document.getElementById("restart-btn");
const finishSetsBtn = document.getElementById("finish-sets-btn");
const backFromSingletoFullbtn = document.getElementById("go-back-btn");

let workoutObject;
let currentWorkout;

document.addEventListener("DOMContentLoaded", () => {
  setEventListeners();
});

async function getWorkout(muscleGroup) {
  let muscleText = muscleGroup;

  muscleText =
    muscleGroup.charAt(0).toUpperCase() +
    (muscleGroup === "legs" ? muscleGroup.slice(1, -1) : muscleGroup.slice(1));

  document.getElementById("workout-list-header").innerHTML =
    `<h2> It's ${muscleText} Day </h2>`;

  try {
    const response = await fetch(
      `/api/exercise/getWorkout?muscle=${muscleGroup}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

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
  workoutList.innerHTML = "";

  workouts.forEach((workout) => {
    const exerciseDiv = document.createElement("div");
    exerciseDiv.className = "exercise";
    exerciseDiv.innerHTML = `<p>${workout.name}</p>`;
    exerciseDiv.dataset.exerciseId = workout.id;

    exerciseDiv.addEventListener("click", () => {
      currentWorkout = workout.name;
      navigateFromTo("#full-workout-modal", "#single-workout-modal");
      let singleWorkoutNameDisplay = document.querySelector(
        ".exercise-description h2",
      );
      let singleWorkoutInstruction = document.querySelector(
        ".exercise-description p",
      );
      singleWorkoutNameDisplay.textContent = workout.name;

      let instructionsPreview =
        workout.instructions.length > 200
          ? workout.instructions.substring(0, 200) + "..."
          : workout.instructions;
      singleWorkoutInstruction.textContent = instructionsPreview;

      singleWorkoutInstruction.dataset.fullInstructions = workout.instructions;
      document.getElementById(
        "single-workout-modal",
      ).dataset.currentExerciseId = workout.id;

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

  finishWorkoutBtn.addEventListener("click", () => {
    navigateFromTo("#full-workout-modal", "#completed-workout-modal");
  });

  restartBtn.addEventListener("click", () => {
    navigateFromTo("#completed-workout-modal", "#selection-modal-hide");
    document.getElementById("workout-list").innerHTML =
      `<div> <div class="exercise"><p>Just one moment...</p></div> </div>`;
  });

  finishSetsBtn.addEventListener("click", () => {
    navigateFromTo("#single-workout-modal", "#full-workout-modal");
    logSets();
  });

  backFromSingletoFullbtn.addEventListener("click", () => {
    navigateFromTo("#single-workout-modal", "#full-workout-modal");

    const setDivs = document.querySelectorAll(".sets .set");

    setDivs.forEach((setDiv) => {
      const weightInput = setDiv.querySelector(".weight");
      const repsInput = setDiv.querySelector(".reps");
      const repsLast = setDiv.querySelector(".last1");
      const weightLast = setDiv.querySelector(".last2");
  
      weightInput.value = "";
      repsInput.value = "";
      repsLast.textContent = "last: " + "0";
      weightLast.textContent = "last: " + "0";

  });

  document.querySelector("#instructions-btn").addEventListener("click", () => {
    let fullInstructions = document.querySelector(".exercise-description p")
      .dataset.fullInstructions;

    document.getElementById("full-instructions").textContent = fullInstructions;

    document.getElementById("instructions-modal").style.display = "block";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("instructions-modal").style.display = "none";
  });
}

async function logSets() {
  const sets = [];
  const setDivs = document.querySelectorAll(".sets .set");

  setDivs.forEach((setDiv) => {
    const weightInput = setDiv.querySelector(".weight");
    const repsInput = setDiv.querySelector(".reps");
    const repsLast = setDiv.querySelector(".last1");
    const weightLast = setDiv.querySelector(".last2");

    sets.push({
      weight: Number(weightInput.value),
      reps: Number(repsInput.value),
    });
    weightInput.value = "";
    repsInput.value = "";
    repsLast.textContent = "last: " + "0";
    weightLast.textContent = "last: " + "0";
  });

  try {
    const response = await fetch("/api/exercise/logSets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workout_name: currentWorkout,
        sets,
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
  } finally {
  }
}

async function getSets(workoutName) {
  try {
    const response = await fetch(`/api/exercise/getSets/${workoutName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Fetching sets for", workoutName);

    if (response.ok) {
      const { workoutDetails, sets } = await response.json();
      console.log("Fetch successful", workoutDetails, sets);

      sets.forEach((set, index) => {
        let setDiv = document.getElementById(`set${index + 1}`);

        const repsLast = setDiv.querySelector(".last1");
        const weightLast = setDiv.querySelector(".last2");
        repsLast.textContent = "last: " + set.reps;
        weightLast.textContent = "last: " + set.weight;
        if (!set.reps) {
          repsLast.value = 0;
        }
        if (!set.weight) {
          weightLast.value = 0;
        }
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
