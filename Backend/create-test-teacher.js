import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Simple teacher schema for testing
const teacherSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const Teacher = mongoose.model('Teacher', teacherSchema);

const createTestTeacher = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Clear existing teachers
    await Teacher.deleteMany({});
    console.log('Cleared existing teachers');
    
    // Create test teacher
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const testTeacher = new Teacher({
      email: 'test@teacher.com',
      password: hashedPassword,
      name: 'Test Teacher',
      employeeId: 'TEST001',
      department: 'Computer Science'
    });
    
    await testTeacher.save();
    console.log('Test teacher created successfully!');
    console.log('Credentials:');
    console.log('- Email: test@teacher.com');
    console.log('- Password: test123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test teacher:', error);
    process.exit(1);
  }
};

createTestTeacher();