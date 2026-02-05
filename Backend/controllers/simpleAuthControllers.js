import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory user storage
let users = [];

// Student registration
export const registerStudent = async (req, res) => {
  const { name, userid, password, rollno, courseName, email } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!userid) missingFields.push('userid');
  if (!password) missingFields.push('password');
  if (!rollno) missingFields.push('rollno');

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields
    });
  }

  try {
    console.log('Processing registration for:', { name, userid, rollno });

    // Check if user already exists
    const existingUser = users.find(user => 
      user.userid === userid || user.rollno === rollno
    );

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this userid or rollno'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      userid,
      password: hashedPassword,
      email: email || null,
      rollno,
      courseName: courseName || null,
      role: 'student',
      createdAt: new Date().toISOString()
    };

    // Save to in-memory storage
    users.push(newUser);
    console.log('User registered successfully:', { id: newUser.id, userid: newUser.userid });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email || null, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-jwt-key-change-this-in-production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: newUser.id,
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
      // Find user by email or userid
      const user = users.find(u => 
        u.email === email || u.userid === email
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-jwt-key-change-this-in-production',
        { expiresIn: '24h' }
      );
      
      res.status(200).json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email || '', 
          role: user.role,
          name: user.name || '',
          userid: user.userid
        } 
      });
    } catch (error) {
      console.error('Login error:', error.message, error.stack);
      res.status(500).json({ message: 'Server error during authentication' });
    }
};

// Helper function to get all users (for testing)
export const getAllUsers = () => users;
