// Importing model definitions from other files
const User = require("./User");
const Workout = require("./Workout");
const Set = require("./Set");
// Defining relationships between models
User.hasMany(Workout, { foreignKey: 'user_id' }); // A User can have many Workouts. 'user_id' is the foreign key in the Workout model that references the User.
Workout.belongsTo(User, { foreignKey: 'user_id' }); // A Workout belongs to a single User, linked by 'user_id'.

Workout.hasMany(Set, { foreignKey: 'workout_id' }); // A Workout can have many Sets. 'workout_id' is the foreign key in the Set model that references the Workout.
Set.belongsTo(Workout, { foreignKey: 'workout_id' }); // A Set belongs to a single Workout, linked by 'workout_id'.

// Exporting the models with their relationships for use elsewhere in the application
module.exports = { User, Workout, Set };
