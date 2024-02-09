const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value.trim();

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
        alert('Failed to log in');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
};

document
  .querySelector('.login')
  .addEventListener('submit', loginFormHandler);
