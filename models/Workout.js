// Importing necessary modules and libraries
const { Model, DataTypes } = require('sequelize'); // Import Sequelize core components for defining models and specifying data types
const sequelize = require('../config/connection'); // Import the Sequelize connection setup from a separate configuration file

// Defining the Workout class by extending Sequelize's Model class
class Workout extends Model { }

// Initializing the Workout model with its schema definition
Workout.init(
    {
        // Schema definition for the Workout model starts here
        id: {
            type: DataTypes.INTEGER, // Specifies the data type for the 'id' field as integer
            allowNull: false, // Makes the 'id' field not nullable, meaning it must have a value
            primaryKey: true, // Designates the 'id' field as the primary key of the Workout table
            autoIncrement: true, // Enables auto-increment for the 'id' field, so it automatically gets a unique value
        },
        name: {
            type: DataTypes.STRING, // Specifies the data type for the 'name' field as string
            allowNull: false, // Makes the 'name' field not nullable, ensuring every workout has a name
        },
        user_id: {
            type: DataTypes.INTEGER, // Specifies the data type for the 'user_id' field as integer
            allowNull: false, // Makes the 'user_id' field not nullable, ensuring every workout is associated with a user
            references: {
                model: 'user', // Establishes a foreign key relationship to the 'user' model
                key: 'id', // Specifies that the 'user_id' field references the 'id' field in the 'user' model
            },
        },
    },
    {
        // Model configuration options
        sequelize, // Specifies the Sequelize instance to be used for this model
        timestamps: false, // Disables automatic creation of 'createdAt' and 'updatedAt' fields
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        underscored: true, // Enables the use of underscores in auto-generated fields instead of camelCasing
        modelName: 'workout', // Sets the model name to 'workout'
    }
);

// Exporting the Workout model for use elsewhere in the application
module.exports = Workout;
