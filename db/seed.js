// Importing Sequelize connection instance
const sequelize = require('../config/connection');
// Importing the User model
const { User } = require('../models');

// Loading user data from a JSON file
const userData = require('./userData.json');

// Defining an asynchronous function to seed the database
const seedDatabase = async () => {
    // Synchronizing all models with the database, forcing a drop and recreate if tables already exist
    await sequelize.sync({ force: true });

    // Bulk creating User instances from the userData JSON, enabling individual hooks and returning data
    await User.bulkCreate(userData, {
        individualHooks: true, // Enables the execution of lifecycle hooks for each record
        returning: true, // Specifies that the created records should be returned after insertion
    });

    // Exiting the process with a success status code (0) after seeding is complete
    process.exit(0);
};

// Executing the seed function
seedDatabase();
