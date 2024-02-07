
// Importing necessary modules and libraries
const { Model, DataTypes } = require('sequelize'); // Sequelize core components for model definition and data types
const sequelize = require('../config/connection'); // Importing the Sequelize connection instance

// Defining the Set class by extending Sequelize's Model class
class Set extends Model { }


// Initializing the Set model with its schema definition
Set.init(
    {
        // Schema definition for the Set model starts here
        id: {
            type: DataTypes.INTEGER, // Data type for the 'id' field
            allowNull: false, // 'id' cannot be null
            primaryKey: true, // 'id' is the primary key
            autoIncrement: true, // 'id' will auto-increment
        },
        reps: {
            type: DataTypes.INTEGER, // Data type for the 'reps' field (number of repetitions)
            allowNull: false, // 'reps' cannot be null
        },
        weight: {
            type: DataTypes.FLOAT, // Data type for the 'weight' field
            allowNull: false, // 'weight' cannot be null
        },
        workout_id: {
            type: DataTypes.INTEGER, // Data type for the 'workout_id' field (foreign key)
            allowNull: false, // 'workout_id' cannot be null
            references: {

                model: 'workout', // References the 'workout' model
                key: 'id', // Specifically, the 'id' field in the 'workout' model

            },
        },
        user_id: { // Corrected placement
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
        }
    }, // Removed extra comma
    {

        // Model configuration options
        sequelize, // Specifies the Sequelize instance to be used
        timestamps: false, // Disables automatic creation of 'createdAt' and 'updatedAt' fields
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        underscored: true, // Enables the use of underscores instead of camelCasing for field names
        modelName: 'set', // Sets the model name to 'set'

    }
);

// Exporting the Set model for use elsewhere in the application
module.exports = Set;
