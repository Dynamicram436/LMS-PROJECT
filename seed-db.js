import seedDatabase from './Backend/seedExamQuestions.js';

console.log('Seeding database with exam questions...');
const result = await seedDatabase();
console.log('Seed result:', result);

if (result.success) {
  console.log('Database seeded successfully!');
  process.exit(0);
} else {
  console.error('Failed to seed database:', result.message);
  process.exit(1);
}