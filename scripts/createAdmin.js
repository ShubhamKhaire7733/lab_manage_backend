import { config } from '../src/config/config.js';
import sequelize from '../src/config/database.js';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: {
        email: 'admin@lab2025.com',
        role: 'admin'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('ID:', existingAdmin.id);
    } else {
      // Create admin user
      const adminUser = await User.create({
        email: 'admin@lab2025.com',
        password: 'Admin@123',
        role: 'admin'
      });

      console.log('Admin user created successfully:');
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('Password: Admin@123');
    }

    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Run the function
createAdminUser(); 