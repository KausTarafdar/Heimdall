import { Request, Response } from 'express';
import Monitor from '../../services/Monitor';

const monitor = new Monitor()

export async function submitHandler(req: Request, res: Response) {
    const ip = req.ip || 'undefined'

    const { headers } = req;

    const isValid = true ? headers['access-token'] === "access-provided": false;

    if (!isValid) {
      const reason = "Invalid headers or access token";

      await monitor.HandleFailedRequests(ip, reason)

      res.status(401).json({ message: reason });
      return
    }

    res.status(200).json({ message: "Request successful" });
    return
}