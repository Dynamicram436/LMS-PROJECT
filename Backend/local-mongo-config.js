// Temporary local MongoDB setup for development
// Install MongoDB locally: https://www.mongodb.com/try/download/community

export const LOCAL_MONGO_CONFIG = {
  connectionString: 'mongodb://localhost:27017/online_exam_system',
  setupInstructions: `
    1. Download and install MongoDB Community Server
    2. Start MongoDB service: 
       - Windows: net start MongoDB
       - Mac: brew services start mongodb-community
       - Linux: sudo systemctl start mongod
    3. Update your .env file:
       MONGO_URL="mongodb://localhost:27017/online_exam_system"
    4. Run seed scripts to populate data:
       node seedCourses.js
       node seedExamQuestions.js
  `
};