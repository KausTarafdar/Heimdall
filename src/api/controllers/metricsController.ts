import { Request, Response } from 'express';
import { FailedRequestModel } from '../../models/failedRequest';
import { RedisService } from '../../services/RedisService';

const redisDB = new RedisService()

export async function getMetricsHandler(req: Request, res: Response) {
    try {
        const totalRequests = await redisDB.GetFailedRequestCounter()
        var metrics = {}
        if (totalRequests && totalRequests > 0){
            metrics = await FailedRequestModel.find({}, "-_id ip reason createdAt");
        }

        res.status(200).json({
            "response": "success",
            "code": 200,
            "data": {
                "TotalFailedRequests": totalRequests,
                "Requests": metrics
            }
        });
        return
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch metrics", error });
        return
    }
}