
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../../models");

router.post("/login", async (req, res) => {
  try {
    // Looks to see if the entered email exists in the database
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      res.status(400).json({ message: 'Incorrect email!' });
      return;
    }
  
    // Checks to see if the entered password matches the password in the database
    // using the checkPassword method defined in the User model.
    const validPassword = await userData.checkPassword(req.body.password);
    console.log(validPassword);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    // Creates a new session for the user with the logged in flag
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json(err);
  }
});


router.post("/register", async (req, res) => {
  try {
    // Check if the email is already in use
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    // Create a new user with the hashed password and additional information
    const newUser = await User.create({
      name: req.body.name, // Adding name to the user creation
      email: req.body.email, // Adding email to the user creation
      password: req.body.password, // Storing the hashed password
    });

    // Save session and log the user in after successful registration
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true; // Logs the user in immediately after registration
      res.json({ user: newUser, message: "Account creation successful! You are now logged in." });
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json(err);
  }  
});


router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    // terminates the session and logs the user out
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
