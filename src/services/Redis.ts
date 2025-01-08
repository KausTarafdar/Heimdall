import Redis from 'ioredis';
import { config } from '../config';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis);

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  async incrementFailedAttempts(ip: string): Promise<number> {
    const key = `failed_attempts:${ip}`;
    const windowInSeconds = config.alert.timeWindowMinutes * 60;

    // Increment the counter and set expiry
    const multi = this.client.multi()
      .incr(key)
      .expire(key, windowInSeconds);

    const results = await multi.exec();
    return results ? (results[0][1] as number) : 0;
  }

  async getRateLimitCount(ip: string): Promise<number> {
    const key = `rate_limit:${ip}`;
    const count = await this.client.get(key);
    return count ? parseInt(count) : 0;
  }

  async incrementRateLimit(ip: string, windowInSeconds: number): Promise<number> {
    const key = `rate_limit:${ip}`;

    const multi = this.client.multi()
      .incr(key)
      .expire(key, windowInSeconds);

    const results = await multi.exec();
    return results ? (results[0][1] as number) : 0;
  }
}