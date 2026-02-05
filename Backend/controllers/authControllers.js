import User from '../models/userSchema.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Student registration
export const registerStudent = async (req, res) => {
  const { name, userid, password, rollno, courseName, email } = req.body;

  // Validate required fields individually to provide specific error messages
  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!userid) missingFields.push('userid');
  if (!password) missingFields.push('password');
  if (!rollno) missingFields.push('rollno');
  // courseName is now optional, so we don't add it to required fields

  // Email is optional, so we don't add it to missingFields if not provided

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields
    });
  }

  try {
    // Check database connection status
    const dbReadyState = mongoose.connection.readyState;
    console.log('Database ready state:', dbReadyState);
    
    // For in-memory mode, we allow registration even if MongoDB is not connected
    if (dbReadyState !== 1 && process.env.DB_MODE !== 'memory') {
    return res.status(503).json({
    message: 'Database not connected. Cannot register user at this time.'
    });
    }

    // Check if user already exists (by userid or rollno)
    const existingUser = await User.findOne({
      $or: [
        { userid },
        { rollno }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this userid or rollno'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      userid,
      password: hashedPassword,
      email: email || undefined,
      rollno,
      courseName: courseName || undefined,
      role: 'student'
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email || null, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-jwt-key-change-this-in-production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: newUser._id,
        role: newUser.role,
        name: newUser.name,
        userid: newUser.userid,
        rollno: newUser.rollno,
        courseName: newUser.courseName || null,
        email: newUser.email || null
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `User already exists with this ${field}`
      });
    }

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED') || error.message.includes('failed to connect')) {
      console.error('Database connection error during registration:', error.message);
      return res.status(503).json({
        message: 'Database connection failed. Cannot register user at this time.',
        error: 'Database connection error'
      });
    }

    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email/User ID and password are required' });
    }
    
    try {
      let user;

      if (email.includes('@')) {
        user = await User.findOne({ email });
      } else {
        user = await User.findOne({ userid: email });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Check if required user properties exist
      if (!user._id || !user.role) {
        console.error('User object missing required properties');
        return res.status(500).json({ message: 'User data error' });
      }
      
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-jwt-key-change-this-in-production',
        { expiresIn: '24h' }
      );
      
      res.status(200).json({ 
        token, 
        user: { 
          id: user._id, 
          email: user.email || '', 
          role: user.role,
          name: user.name || '',
          userid: user.userid
        } 
      });
    } catch (error) {
      console.error('Login error:', error.message, error.stack);
      // Don't expose internal error details to client
      res.status(500).json({ message: 'Server error during authentication' });
    }
};