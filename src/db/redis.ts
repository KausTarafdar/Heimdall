import Redis from "ioredis";
import { config } from "../config";

const redis = new Redis(config.redis)
redis.on('connect', ()=> {
    console.log('Redis connected')
  })
redis.on('error', (error) => {
    console.error('Redis error:', error);
  });


export default redis
