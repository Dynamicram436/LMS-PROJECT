// Test script to verify exam history fetch
// This should be run with: node test-exam-history.js (after converting to .mjs or running with --input-type=module)

(async () => {
  try {
    // Dynamic import for ES modules
    const { default: db } = await import('./utils/db.js');
    const { default: User } = await import('./models/userSchema.js');
    const { default: ExamAttempt } = await import('./models/examAttemptSchema.js');

    await db();
    console.log('Connected to MongoDB');

    // Find a user with exam attempts
    const users = await User.find().limit(5);
    console.log(`\n=== Found ${users.length} users ===`);

    for (const user of users) {
      console.log(`\n--- User: ${user.userid} ---`);
      console.log(`CourseProgress count: ${user.courseProgress.length}`);

      if (user.courseProgress.length > 0) {
        user.courseProgress.forEach((course, idx) => {
          console.log(`  Course ${idx}: courseId="${course.courseId}" (type: ${typeof course.courseId})`);
          console.log(`    examAttempts: ${course.examAttempts?.length || 0}`);
          console.log(`    exam.attempts: ${course.exam?.attempts || 0}`);
        });
      }

      // Also check ExamAttempt collection
      const examAttempts = await ExamAttempt.find({ userId: user.userid });
      console.log(`\nExamAttempt collection records: ${examAttempts.length}`);
      examAttempts.forEach((attempt, idx) => {
        console.log(`  Attempt ${idx}: courseId="${attempt.courseId}" (type: ${typeof attempt.courseId}), score=${attempt.score}%`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
