require('dotenv').config();
const connectDB = require('./config/db');
const { seedDatabase } = require('./seedData');

async function seed() {
  await connectDB();
  const result = await seedDatabase({ clear: true });
  console.log('Seed complete.');
  console.log(`Admin login: ${result.email} / ${result.password}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
