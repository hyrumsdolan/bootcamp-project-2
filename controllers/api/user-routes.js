const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../../models");

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      res.status(400).json({ message: "Incorrect email!" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    console.log(validPassword);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

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
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      res.json({
        user: newUser,
        message: "Account creation successful! You are now logged in.",
      });
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
