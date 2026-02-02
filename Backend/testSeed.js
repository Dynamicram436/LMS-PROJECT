const seedData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/course/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Seed result:', result);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData();
