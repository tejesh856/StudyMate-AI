import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/.env` });

// Create a new IORedis client with credentials
const client = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USER || undefined,    // Optional
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  maxRetriesPerRequest: null, // Recommended for BullMQ and to prevent retry storms
});

// Optional: Log connection events
client.on('connect', () => {
  console.log('✅ Redis client connected');
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

// Connection wrapper to mimic the original connectRedis function
const connectRedis = async () => {
  try {
    // ioredis connects on instantiation, so we can just ping to check
    await client.ping();
    console.log('✅ Redis ping successful');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
};

await connectRedis();

export { client };
