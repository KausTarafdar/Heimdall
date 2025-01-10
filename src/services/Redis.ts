import Redis from 'ioredis';
import { config } from '../config';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis);
    this.client.on('connect', ()=> {
      console.log('Redis connected')
    })
    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  async addIpAlertTime(ip: string): Promise<number>{
    try {
      const key: string = ip;
      const value: number = Date.now()

      await this.client.set(key, value)
      return 1
    } catch (error: unknown) {
      return 0
    }
  }

  async getLastAlertForIp(ip: string): Promise<number>{
    const timestamp = await this.client.get(ip)
    if (timestamp === null) {
      return -1
    }
    return parseInt(timestamp)
  }
}