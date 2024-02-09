const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value.trim();
  const loginErrorDiv = document.querySelector('#login-error'); // Get the error div

  if (email && password) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log("Successful");
        document.location.replace('/');
      } else {
        console.log("Unsuccessful");
        loginErrorDiv.textContent = 'Incorrect email or password! Please try again.'; // Set error message
        loginErrorDiv.style.display = 'block'; // Make the error div visible
      }
    } catch (error) {
      console.error('An error occurred:', error);
      loginErrorDiv.textContent = 'An error occurred. Please try again.'; // Set error message for unexpected errors
      loginErrorDiv.style.display = 'block'; // Make the error div visible
    }
  }
};

document.getElementById('login-form').addEventListener('submit', loginFormHandler); // Updated to target the form by ID
