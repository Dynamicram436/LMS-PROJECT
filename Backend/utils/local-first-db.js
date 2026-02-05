import mongoose from 'mongoose';

// In-memory storage for development when MongoDB is not available
let inMemoryDB = {
  users: [],
  isConnected: false
};

// Robust DB connector with local-first (or Atlas-first) selection via env
// Supported env vars:
// - DB_MODE: 'local' | 'atlas' | 'auto' | 'memory' (default: 'auto')
// - MONGODB_LOCAL_URI: e.g., mongodb://127.0.0.1:27017/lms_db
// - MONGO_URL or MONGODB_URL: Atlas URI
// - DB_CONNECT_TIMEOUT_MS: server selection timeout (default 10000)

const getEnv = (key, fallback) => {
  const v = process.env[key];
  return v !== undefined && v !== '' ? v : fallback;
};

const tryMemory = async () => {
  console.log('📡 Using in-memory database for development...');
  inMemoryDB.isConnected = true;
  console.log('✅ Connected to in-memory database successfully');
  console.log('📊 Database: memory_db');
  console.log('🔗 Mongoose readyState: 1 (connected)');
};

const connectWithUri = async (uri, label, timeoutMs) => {
  console.log(`📡 Connecting to ${label}...`);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: timeoutMs,
    maxPoolSize: 10,
  });
  console.log(`✅ Connected to ${label} successfully`);
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🔗 Mongoose readyState: ${mongoose.connection.readyState}`);
};

const connectDB = async () => {
  const mode = getEnv('DB_MODE', 'auto'); // 'local' | 'atlas' | 'auto'
  const timeoutMs = parseInt(getEnv('DB_CONNECT_TIMEOUT_MS', '10000'), 10);
  const localUri = getEnv('MONGODB_LOCAL_URI', 'mongodb://127.0.0.1:27017/lms_db');
  const atlasUri = getEnv('MONGO_URL', getEnv('MONGODB_URL'));

  const tryLocal = async () => {
    await connectWithUri(localUri, 'local MongoDB', timeoutMs);
    // Optional diagnostics
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log('📁 Collections:', collections.map(c => c.name));
    } catch (e) {
      // non-fatal
    }
  };

  const tryAtlas = async () => {
    if (!atlasUri) {
      throw new Error('Atlas URI not configured (set MONGO_URL or MONGODB_URL)');
    }
    await connectWithUri(atlasUri, 'MongoDB Atlas', timeoutMs);
  };

  // Selection strategy
  const strategies = {
    local: [tryLocal, tryAtlas, tryMemory],
    atlas: [tryAtlas, tryLocal, tryMemory],
    memory: [tryMemory],
    auto: [
      // Prefer local if service is available; otherwise Atlas; otherwise memory
      async () => {
        try {
          await tryLocal();
        } catch (e) {
          console.log(`❌ Local MongoDB failed: ${e.message}`);
          throw e;
        }
      },
      async () => {
        try {
          await tryAtlas();
        } catch (e) {
          console.log(`❌ Atlas connection failed: ${e.message}`);
          throw e;
        }
      },
      async () => {
        try {
          await tryMemory();
        } catch (e) {
          console.log(`❌ Memory database failed: ${e.message}`);
          throw e;
        }
      }
    ]
  };

  const [primary, fallback] = strategies[mode] || strategies.auto;

  try {
    await primary();
    console.log(`✅ DB connected. Mongoose readyState=${mongoose.connection.readyState}`);
    return true;
  } catch (primaryErr) {
    console.log('🔄 Trying fallback connection...');
    try {
      if (fallback) {
        await fallback();
        return true;
      } else {
        throw new Error('No fallback connection available');
      }
    } catch (fallbackErr) {
      console.error('❌ All database connection attempts failed.');
      console.error('Primary error:', primaryErr.message);
      if (fallback) {
        console.error('Fallback error:', fallbackErr.message);
      }
      console.log('\n💡 Troubleshooting tips:');
      console.log('- If using local MongoDB: ensure mongod is running on 127.0.0.1:27017 or set MONGODB_LOCAL_URI');
      console.log('- If using Atlas: set MONGO_URL (or MONGODB_URL), allow your IP in Atlas Network Access, ensure cluster is running');
      console.log('- Set DB_MODE=atlas to force Atlas, DB_MODE=local to force local, or DB_MODE=memory to force in-memory');
      console.log('- For development, you can use DB_MODE=memory to use in-memory storage');
      return false;
    }
  }
};

export default connectDB;
