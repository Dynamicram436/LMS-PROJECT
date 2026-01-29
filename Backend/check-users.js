import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://bhargavramgomatham_db_user:436465@cluster0.lc2qwz1.mongodb.net/";

try {
  await mongoose.connect(MONGODB_URI, { dbName: 'userDB' });
  console.log('Connected to MongoDB');
  
  // Get all users
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('Users in database:');
  users.forEach((user, index) => {
    console.log(`${index + 1}. userid: ${user.userid}, email: ${user.email}`);
  });
  
  process.exit(0);
} catch (error) {
  console.error('Error connecting to database:', error);
  process.exit(1);
}