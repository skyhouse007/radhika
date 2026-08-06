const mongoose = require('mongoose');

let memoryServer = null;

async function connectDB() {
  if (process.env.USE_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB connected (in-memory)');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error(
      'Tip: start MongoDB locally, set MONGODB_URI to Atlas, or set USE_MEMORY_DB=true in .env'
    );
    throw err;
  }
}

module.exports = connectDB;
