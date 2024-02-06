// Importing necessary modules and libraries
const { Model, DataTypes } = require('sequelize'); // Sequelize core components
const bcrypt = require('bcrypt'); // Library for hashing passwords
const sequelize = require('../config/connection'); // Sequelize connection instance

// Extending the Sequelize Model class to define a User model
class User extends Model {
    // Method to compare a submitted login password with the hashed password stored in the database
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password); // Returns true if passwords match, false otherwise
    }
}

// Initializing the User model with its schema definition
User.init(
    {
        // Schema definition starts here
        id: {
            type: DataTypes.INTEGER, // Specifies data type for ID
            allowNull: false, // Disallows null values for ID
            primaryKey: true, // Marks ID as the primary key
            autoIncrement: true, // Enables auto-increment for ID
        },
        name: {
            type: DataTypes.STRING, // Specifies data type for name
            allowNull: false, // Disallows null values for name
        },
        email: {
            type: DataTypes.STRING, // Specifies data type for email
            allowNull: false, // Disallows null values for email
            unique: true, // Enforces uniqueness for email values
            validate: {
                isEmail: true, // Validates the email format
            },
        },
        password: {
            type: DataTypes.STRING, // Specifies data type for password
            allowNull: false, // Disallows null values for password
            validate: {
                len: [8], // Sets a minimum length of 8 characters for the password
            },
        },
    },
    {
        // Model options
        hooks: {
            // Lifecycle hooks
            beforeCreate: async (newUserData) => {
                // Hook to hash password before creating a new user record
                newUserData.password = await bcrypt.hash(newUserData.password, 10); // Hashes the password with a cost of 10
                return newUserData; // Returns the modified user data
            },
        },
        sequelize, // Specifies the Sequelize instance to attach this model to
        timestamps: false, // Disables automatic creation of createdAt and updatedAt fields
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        underscored: true, // Enables snake_case naming for automatically generated columns
        modelName: 'user', // Sets the model name to 'user'
    }
);

// Exporting the User model for use in other parts of the application
module.exports = User;
