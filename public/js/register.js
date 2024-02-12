const registerFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#create-account-username").value.trim();
  const email = document.querySelector("#create-account-email").value.trim();
  const password = document
    .querySelector("#create-account-password")
    .value.trim();
  const registerSuccessDiv = document.querySelector("#register-success"); // Get the success div

  if (name && email && password) {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("successful");
        registerSuccessDiv.textContent =
          "Account successfully created! Redirecting..."; // Set success message
        registerSuccessDiv.style.display = "block"; // Make the success div visible

        // Wait a few seconds before redirecting
        setTimeout(() => {
          document.location.replace("/selection");
        }, 2000); // Adjust the delay here as needed
      } else {
        console.log("Unsuccessful");
        const responseData = await response.json(); // Assuming server sends a JSON response
        alert(`Failed to register: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  } else {
    alert("Please fill in all fields.");
  }
};

document
  .querySelector(".create-account form")
  .addEventListener("submit", registerFormHandler);
