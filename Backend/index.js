import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import teacherAuthRoutes from './routes/teacherAuthRoute.js';
import teacherRoutes from './routes/teacherRoute.js';
import cors from 'cors';
import connectDB from './utils/local-first-db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database first, then start server
const startServer = async () => {
  console.log('🚀 Starting server...');
  
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Database connection failed. Server will not start.');
    process.exit(1);
  }

  console.log(`🔗 Mongoose readyState on startup: ${mongoose.connection.readyState}`);
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Registration endpoint: http://localhost:${PORT}/auth/register`);
  });
};

// Routes
app.use('/auth', authRoutes);
app.use('/teacher-auth', teacherAuthRoutes); // New teacher auth routes
app.use('/teachers', teacherRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.status(200).json({
    status: 'OK',
    database: dbStates[dbState] || 'connected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Start server
startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
