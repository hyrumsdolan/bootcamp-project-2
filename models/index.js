// Importing model definitions from other files
const User = require("./User");
const Workout = require("./Workout");
const Set = require("./Set");
// Defining relationships between models
User.hasMany(Workout, { foreignKey: 'user_id' }); // A User can have many Workouts. 'user_id' is the foreign key in the Workout model that references the User.
Workout.belongsTo(User, { foreignKey: 'user_id' }); // A Workout belongs to a single User, linked by 'user_id'.




// Adjusting according to your new structure
User.hasMany(Set, { foreignKey: 'user_id' }); // Assuming you want to track which sets belong to which user directly
Set.belongsTo(User, { foreignKey: 'user_id' }); // Corresponding association from Set to User

Workout.hasMany(Set, { foreignKey: 'workout_id' }); // Keeps track of which sets belong to which workout
Set.belongsTo(Workout, { foreignKey: 'workout_id' }); // Corresponding association from Set to Workout


// Exporting the models with their relationships for use elsewhere in the application
module.exports = { User, Workout, Set };
