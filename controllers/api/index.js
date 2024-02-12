const router = require("express").Router();

const userRoutes = require("./user-routes");
const exerciseRoutes = require("./exercise-routes");

// Use the routes
router.use("/users", userRoutes);
router.use("/exercise", exerciseRoutes);

module.exports = router;
