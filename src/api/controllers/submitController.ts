import { Request, Response } from 'express';
import { FailedRequestModel } from '../../models/failedRequest';
import { config } from '../../config';
import { sendAlert } from '../../services/Alert';

export async function submitHandler(req: Request, res: Response) {
    const ip = req.ip || 'unknown';
    const { headers, body } = req;

    const isValid = headers['access-token'] === "valid_token";

    if (!isValid) {
      const reason = "Invalid headers or access token";

      await FailedRequestModel.create({ ip, reason });

      const failedCount = await FailedRequestModel.countDocuments({ ip });
      if (failedCount >= config.alert.maxAttempts) {
        console.log(`{ip} notification sent after 5 invalid attempts`)
        sendAlert(ip);
      }

      res.status(401).json({ message: reason });
    }

    res.status(200).json({ message: "Request successful" });
}