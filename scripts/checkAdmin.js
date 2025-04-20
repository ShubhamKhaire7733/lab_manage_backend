import { config } from '../src/config/config.js';
import sequelize from '../src/config/database.js';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const checkAdminUser = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if admin user exists
    const adminUser = await User.findOne({
      where: {
        email: 'admin@lab2025.com',
        role: 'admin'
      }
    });

    if (adminUser) {
      console.log('Admin user exists:');
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('ID:', adminUser.id);
    } else {
      console.log('Admin user does not exist in the database.');
    }

    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error checking admin user:', error);
  }
};

// Run the function
checkAdminUser(); 