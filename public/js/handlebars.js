document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed"); // Debugging line
    const form = document.getElementById("login-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
      
            console.log(data); 
        });
    } else {
        console.log("Form not found"); 
    }
});


const submitButton = document.getElementById("submit");
if (submitButton) {
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        fetchExercisesForMuscle('biceps');
        console.log("Submit button clicked"); 
    });
}

// Example function to call the Express route from client-side JavaScript
function fetchExercisesForMuscle(muscle = 'biceps') {
    // Update the URL to include the `/api` prefix
    const url = `/api/exercise/getRandom`;
  
    // Use the fetch API to make the request
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        console.log(data); // Handle the data from the server
        // Here you can update your webpage dynamically with the received data
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
}
  
  // Example usage
  fetchExercisesForMuscle('biceps');
  