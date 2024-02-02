// routes for homepage

const router = require("express").Router();

// get render login
router.get("/", (req, res) => {
  
  res.render("login");
});

module.exports = router;