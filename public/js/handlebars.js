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


  
  // Example usage
  fetchExercisesForMuscle('biceps');
  