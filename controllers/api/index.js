const router = require("express").Router();

const userRoutes = require("./user-routes");
const exerciseRoutes = require("./exercise-routes"); // Ensure this matches the filename

// Use the routes
router.use("/users", userRoutes);
router.use("/exercise", exerciseRoutes); // This line was missing

module.exports = router;
