import express from 'express';
import logger from './logger/logger';
import dotenv from 'dotenv';
import eventListner from './event-consumer';
dotenv.config();

const app = express();
const port = process.env.SERVICE_PORT;

eventListner().catch((e) => logger.error('error on subscribing to topic'));

app.listen(port, () => {
  logger.info(`Activation service running on port ${port}`);
});
