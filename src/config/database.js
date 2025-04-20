import { Sequelize } from 'sequelize';
import { config } from './config.js';

console.log('Initializing database connection with config:', {
  database: config.database.name,
  username: config.database.username,
  host: config.database.host,
  port: config.database.port,
  dialect: 'mysql'
});

const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      paranoid: true // Enable soft deletes
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 20000,
      // Additional MySQL specific options
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true
    }
  }
);

// Test the database connection with retries
const testConnection = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      return true;
    } catch (error) {
      console.error(`Connection attempt ${attempt}/${retries} failed:`, error.message);
      
      if (attempt === retries) {
        console.error('All connection attempts failed. Last error:', error);
        if (error.original) {
          console.error('Original error:', error.original);
        }
        return false;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(1.5, attempt - 1), 10000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Call the test connection function
testConnection();

export default sequelize;