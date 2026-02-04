import mongoose from 'mongoose';
import { Teacher } from './models/teachers/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    
    // Clear existing teachers
    await Teacher.deleteMany({});
    
    // Create default admin teacher
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const adminTeacher = new Teacher({
      email: 'admin@teacher.edu',
      password: hashedPassword,
      name: 'Admin Teacher',
      employeeId: 'EMP001',
      department: 'Computer Science',
      designation: 'Professor',
      qualification: 'PhD in Computer Science',
      subjects: ['Web Development', 'Database Systems', 'Software Engineering']
    });
    
    await adminTeacher.save();
    
    console.log('Teachers seeded successfully!');
    console.log('Admin teacher created:');
    console.log('- Email: admin@teacher.edu');
    console.log('- Password: password123');
    console.log('- Employee ID: EMP001');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teachers:', error);
    process.exit(1);
  }
};

seedTeachers();

export default seedTeachers;