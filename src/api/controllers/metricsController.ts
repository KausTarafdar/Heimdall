import { Request, Response } from "express";

import { FailedRequestModel } from "../../models/failedRequest";
import { RedisService } from "../../services/RedisService";

const redisDB = new RedisService()

export async function getMetricsHandler(req: Request, res: Response) {
    try {
        const redisKey = "metrics:failed_requests";
        const cachedMetrics = await redisDB.client.get(redisKey);

        if (cachedMetrics) {
            res.status(200).json({
                response: "success",
                code: 200,
                data: JSON.parse(cachedMetrics),
            });
            return
        }

        const totalRequests = await redisDB.GetFailedRequestCounter();
        let metrics = {};

        if (totalRequests && totalRequests > 0) {
            metrics = await FailedRequestModel.find({}, "-_id ip reason createdAt");
        }

        const responseData = {
            TotalFailedRequests: totalRequests,
            Requests: metrics,
        };

        // Cache the metrics
        await redisDB.client.set(
            redisKey,
            JSON.stringify(responseData),
            'EX',
            300
        ); // Cache for 5 mins

        res.status(200).json({
            response: "success",
            code: 200,
            data: responseData,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch metrics", error });
    }
}