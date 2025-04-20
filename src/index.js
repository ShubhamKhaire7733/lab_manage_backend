import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { config } from './config/config.js';
import sequelize from './config/database.js';
import setupAssociations from './models/associations.js';
import adminRoutes from './routes/adminRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/ping', (req, res)=>{
  res.send("Pong")
})
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/batches', batchRoutes);

// Setup model associations
setupAssociations();

// Database sync and server start
const PORT = config.server.port || 3000;

const startServer = async () => {
  try {
    // Sync database without altering tables
    await sequelize.sync({ 
      alter: false, // Don't automatically alter tables
      force: false  // Don't drop and recreate tables
    });
    console.log('Database synced successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();