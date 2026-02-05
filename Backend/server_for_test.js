import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import teacherAuthRoutes from './routes/teacherAuthRoute.js';
import teacherRoutes from './routes/teacherRoute.js';
import cors from 'cors';
import connectDB from './utils/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database with retry logic
const startServer = async () => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    const connected = await connectDB();
    if (connected) break;

    retries++;
    if (retries < maxRetries) {
      console.log(`\n🔄 Retrying connection (${retries}/${maxRetries})...\n`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
    }
  }

  if (mongoose.connection.readyState !== 1) {
    console.warn('\n⚠️ Server starting without database connection. Some features may be limited.\n');
  }
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
    database: dbStates[dbState],
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Start database connection and server
startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});