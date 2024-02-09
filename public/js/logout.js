const logoutFormHandler = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        console.log("Logout successful");
        // Redirect the user to the login page or home page after logout
        document.location.replace('/login');
    } else {
        console.log("Logout unsuccessful");
        alert('Failed to log out');
    }
};

const logoutButton = document.getElementById('logout-button');

if (logoutButton) {
    logoutButton.addEventListener('click', logoutFormHandler);
} else {
    console.log('Logout button not found');
}
