const User = require("./User");
const Workout = require("./Workout");
const Set = require("./Set");

User.hasMany(Workout, { foreignKey: 'user_id' });
Workout.belongsTo(User, { foreignKey: 'user_id' });

Workout.hasMany(Set, { foreignKey: 'workout_id' });
Set.belongsTo(Workout, { foreignKey: 'workout_id' });

module.exports = { User, Workout, Set };
