import { Request, Response } from 'express';
import { FailedRequestModel } from '../../models/failedRequest';

export async function getMetricsHandler(req: Request, res: Response) {
    try {
        const totalRequests = await FailedRequestModel.countDocuments()
        const metrics = await FailedRequestModel.find({}, "-_id ip reason");

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