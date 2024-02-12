const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value.trim();
  const loginErrorDiv = document.querySelector("#login-error");

  if (email && password) {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("Successful");
        document.location.replace("/");
      } else {
        console.log("Unsuccessful");
        loginErrorDiv.textContent =
          "Incorrect email or password! Please try again.";
        loginErrorDiv.style.display = "block";
        setTimeout(() => {
          loginErrorDiv.style.display = "none";
        }, 5000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      loginErrorDiv.textContent = "An error occurred. Please try again.";
      loginErrorDiv.style.display = "block";
    }
  }
};

document
  .getElementById("login-form")
  .addEventListener("submit", loginFormHandler);
