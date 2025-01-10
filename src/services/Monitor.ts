import { FailedRequestModel } from "../models/failedRequest";
import { sendAlert } from "./Alert";
import { RedisService } from "./Redis";

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
        const failedRequestDoc = await FailedRequestModel.create({ ip, reason });

        await failedRequestDoc.save()

        const previousFailedRequests = await this.getPreviousFailedRequest(ip)
        console.log(previousFailedRequests)

        if (previousFailedRequests >= this.THRESHOLD){
            sendAlert(ip).catch((err)=> {console.error("Error in sending email", err)})
            console.log("Sent email")
            await this.redis.addIpAlertTime(ip)
        }
    }

    private async getPreviousFailedRequest(ip: string): Promise<number> {
        const now = new Date();

        const currWindowStart = now.getTime() - this.WINDOW

        // For Email cool down period of 5 mins
        const lastAlertTime = await this.redis.getLastAlertForIp(ip) + 5 * 60 * 1000
        console.log(lastAlertTime)

        if (lastAlertTime === -1 || currWindowStart >= lastAlertTime) {
            const failedCount = await FailedRequestModel.countDocuments({
                ip: ip,
                createdAt: { $gt: new Date(currWindowStart) }
            });
            return failedCount
        }
        return -1
    }
}