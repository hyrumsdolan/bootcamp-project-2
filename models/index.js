// Importing model definitions from other files
const User = require("./User");
const Workout = require("./Workout");
const Set = require("./Set");


// Adjusting according to your new structure
User.hasMany(Set, { foreignKey: 'user_id' }); // Assuming you want to track which sets belong to which user directly
Set.belongsTo(User, { foreignKey: 'user_id' }); // Corresponding association from Set to User

Workout.hasMany(Set, { foreignKey: 'workout_id' }); // Keeps track of which sets belong to which workout
Set.belongsTo(Workout, { foreignKey: 'workout_id' }); // Corresponding association from Set to Workout


// Exporting the models with their relationships for use elsewhere in the application
module.exports = { User, Workout, Set };
