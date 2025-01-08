import { Router } from "express";
import { submitHandler } from "./controllers/submitController";
import { getMetricsHandler } from "./controllers/metricsController";

const apiRouter = Router()

apiRouter.post('/api/submit', submitHandler);
apiRouter.get('/api/metrics', getMetricsHandler);

export default apiRouter