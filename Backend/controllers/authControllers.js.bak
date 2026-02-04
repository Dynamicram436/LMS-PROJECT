import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// User login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ 
            token, 
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                name: user.name
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Teacher login
export const teacherLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email, role: 'teacher' });
        if (!user) return res.status(404).json({ message: 'Teacher not found' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ 
            token, 
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                name: user.name
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
