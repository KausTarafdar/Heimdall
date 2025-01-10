import { FailedRequestModel } from "../models/failedRequest";
import emailQueue from "./Alert";
import { RedisService } from "./RedisService";

export default class Monitor {

    private WINDOW: number;
    private THRESHOLD: number;
    private redis: RedisService;

    constructor(){
        this.WINDOW = 10*60*1000 //10 mins in ms
        this.THRESHOLD = 5 //no. of failed attempts for alert
        this.redis = new RedisService()
    }

    public async HandleFailedRequests(ip: string, reason: string) {
        const redisKey = "metrics:failed_requests";

        const failedRequestDoc = await FailedRequestModel.create({ ip, reason });

        await failedRequestDoc.save()
        this.redis.FailedRequestCounterIncrement()

        await this.redis.client.del(redisKey);

        const previousFailedRequests = await this.getPreviousFailedRequest(ip)

        if (previousFailedRequests >= this.THRESHOLD){
            emailQueue.add({
                "ip": ip,
                "reason": reason
            })
            console.log("Sent email")
            await this.redis.addIpAlertTime(ip)
        }
    }

    private async getPreviousFailedRequest(ip: string): Promise<number> {
        const now = new Date();

        const currWindowStart = now.getTime() - this.WINDOW

        // Previous alert sent at
        const lastAlertTime = await this.redis.getLastAlertForIp(ip)

        // If first alert or previous alert before current window starting
        if (lastAlertTime === -1 || currWindowStart >= lastAlertTime) {
            const failedCount = await FailedRequestModel.countDocuments({
                ip: ip,
                createdAt: { $gt: new Date(currWindowStart) }
            });
            return failedCount
        }
        // Else send alert every 5 failures
        else {
            const failedCount = await FailedRequestModel.countDocuments({
                ip: ip,
                createdAt: { $gt: new Date(lastAlertTime) }
            });
            return failedCount
        }
        return -1
    }

}