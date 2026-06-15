import { createClient } from 'redis';


const redisUrl = 'redis://' + (process.env.REDIS_URL || 'localhost:6379');

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Singleton, 1 connect for 1 query
redisClient.connect();
