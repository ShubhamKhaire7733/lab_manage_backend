import express from 'express';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

// Add student routes
app.use('/api/students', studentRoutes);

// ... existing code ...

// ... existing code ... 

export default app; 