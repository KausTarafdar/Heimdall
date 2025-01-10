import express from "express";
import morgan from "morgan";
import apiRouter from "./api";
import { config } from "./config";
import connectToMongoDB from "./db/db";

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status - :response-time ms'));
app.use(apiRouter);

const PORT = config.server.port;

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`App running at PORT ${PORT} on worker ${process.pid}`);
});
