const registerFormHandler = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Get user input values from the login form
    const name = document.querySelector('#create-account-username').value.trim();
    const email = document.querySelector('#create-account-email').value.trim();
    const password = document.querySelector('#create-account-password').value.trim();
  
    if (name && email && password) {
      // Send a POST request to the server with user login credentials
      const response = await fetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log("successfull")
        document.location.replace('/');
      } else {
        console.log("Unsuccessfull");
        alert('Failed to register');
      }
    }
  };
  
  document
    .querySelector('.register-form')
    .addEventListener('submit', registerFormHandler);
  