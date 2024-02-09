const registerFormHandler = async (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get user input values from the login form
  const name = document.querySelector('#create-account-username').value.trim();
  const email = document.querySelector('#create-account-email').value.trim();
  const password = document.querySelector('#create-account-password').value.trim();

  if (name && email && password) {
      try {
          // Send a POST request to the server with user login credentials
          const response = await fetch('/api/users/register', {
              method: 'POST',
              body: JSON.stringify({ name, email, password }),
              headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
              console.log("successful");
              document.location.replace('/selection');
          } else {
              // Handle non-OK responses by logging them and showing an alert
              console.log("Unsuccessful");
              const responseData = await response.json(); // Assuming server sends a JSON response
              alert(`Failed to register: ${responseData.message}`);
          }
      } catch (error) {
          // Catch and handle errors that occur during the fetch operation
          console.error("Registration error:", error);
          alert('An error occurred during registration.');
      }
  } else {
      // If not all form fields are filled, alert the user
      alert('Please fill in all fields.');
  }
};

document
  .querySelector('.create-account')
  .addEventListener('submit', registerFormHandler);
