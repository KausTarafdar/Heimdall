import Redis from 'ioredis';
import { config } from '../config';
import redis from '../db/redis';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = redis
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

  public async FailedRequestCounterIncrement(){
    const failedCount = await this.client.get("FailedCount")
    if (failedCount !== null){
      this.client.incr("FailedCount")
    }
  }

  public async GetFailedRequestCounter(){
    return parseInt(await this.client.get("FailedCount") || '0')
  }
}