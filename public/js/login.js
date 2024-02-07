const loginFormHandler = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Get user input values from the login form
    const email = document.querySelector('#login-email').value.trim();
    const password = document.querySelector('#login-password').value.trim();
  
    if (email && password) {
      // Send a POST request to the server with user login credentials
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log("successful");
        // document.location.replace('/');
      } else {
        console.log("Unsuccessfull");
        alert('Failed to log in');
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  