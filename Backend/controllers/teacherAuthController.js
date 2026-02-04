import Teacher from '../models/teachers/teacherSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Temporary in-memory storage for testing
const testTeachers = [
  {
    _id: 'test-teacher-1',
    email: 'test@teacher.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', // bcrypt hash of 'test123'
    name: 'Test Teacher',
    employeeId: 'TEST001',
    department: 'Computer Science',
    isActive: true,
    comparePassword: async function(plainPassword) {
      return await bcrypt.compare(plainPassword, this.password);
    }
  }
];

// Teacher login
export const teacherLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find teacher by email (check in-memory first, then database)
        let teacher = testTeachers.find(t => t.email === email);
        
        if (!teacher) {
            // Try database if not found in memory
            try {
                teacher = await Teacher.findOne({ email });
            } catch (dbError) {
                console.log('Database error, using test data only');
            }
        }
        
        if (!teacher) {
            return res.status(404).json({ 
                success: false,
                message: 'Teacher not found' 
            });
        }

        // Check if teacher is active
        if (!teacher.isActive) {
            return res.status(401).json({ 
                success: false,
                message: 'Account is deactivated' 
            });
        }

        // Validate password
        const isPasswordValid = await teacher.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        teacher.lastLogin = new Date();
        await teacher.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: teacher._id, 
                email: teacher.email, 
                role: 'teacher',
                name: teacher.name
            },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            success: true,
            token, 
            user: { 
                id: teacher._id, 
                email: teacher.email, 
                role: 'teacher',
                name: teacher.name,
                employeeId: teacher.employeeId,
                department: teacher.department
            } 
        });
    } catch (error) {
        console.error('Teacher login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login',
            error: error.message 
        });
    }
};

// Teacher registration (for admin use)
export const registerTeacher = async (req, res) => {
    const { email, password, name, employeeId, department, designation, qualification, subjects } = req.body;

    try {
        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ 
            $or: [{ email }, { employeeId }] 
        });
        
        if (existingTeacher) {
            return res.status(400).json({ 
                success: false,
                message: 'Teacher with this email or employee ID already exists' 
            });
        }

        // Create new teacher
        const newTeacher = new Teacher({
            email,
            password,
            name,
            employeeId,
            department,
            designation: designation || '',
            qualification: qualification || '',
            subjects: subjects || []
        });

        await newTeacher.save();

        res.status(201).json({ 
            success: true,
            message: 'Teacher registered successfully',
            teacher: {
                id: newTeacher._id,
                email: newTeacher.email,
                name: newTeacher.name,
                employeeId: newTeacher.employeeId,
                department: newTeacher.department
            }
        });
    } catch (error) {
        console.error('Teacher registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration',
            error: error.message 
        });
    }
};

// Get teacher profile
export const getTeacherProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.user.id).select('-password');
        
        if (!teacher) {
            return res.status(404).json({ 
                success: false,
                message: 'Teacher not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            teacher 
        });
    } catch (error) {
        console.error('Get teacher profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error retrieving profile',
            error: error.message 
        });
    }
};

// Update teacher profile
export const updateTeacherProfile = async (req, res) => {
    const { name, department, designation, qualification, subjects } = req.body;

    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.user.id,
            { 
                ...(name && { name }),
                ...(department && { department }),
                ...(designation && { designation }),
                ...(qualification && { qualification }),
                ...(subjects && { subjects }),
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!teacher) {
            return res.status(404).json({ 
                success: false,
                message: 'Teacher not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Profile updated successfully',
            teacher 
        });
    } catch (error) {
        console.error('Update teacher profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error updating profile',
            error: error.message 
        });
    }
};