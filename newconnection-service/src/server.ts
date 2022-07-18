import express, {NextFunction, Request, Response} from 'express';
import logger from './logger/logger';
import dotenv from 'dotenv';
import eventListner from './event-consumer';
import {NewConnectionService} from './service/newConnection.service';
dotenv.config();

const app = express();
const port = process.env.SERVICE_PORT;

eventListner().catch((e) => logger.error('error on subscribing to topic'));
app.use(express.json());

app.post(
  '/connection',
  async (request: Request, response: Response, next: NextFunction) => {
    if (
      request.body.passportNumber == undefined ||
      request.body.type != 'NEW_CONNECTION'
    ) {
      logger.error(
        `invalid request. passportNumber: ${request.body.passportNumber} type: ${request.body.type}`
      );
      response.status(400).send({message: 'Invalid request body'});
    }
    logger.debug(
      `new connection request initiated for ${request.body.passportNumber}`
    );

    const newConnectionService: NewConnectionService =
      new NewConnectionService();
    const uniqueId: string | void = await newConnectionService
      .initiateNewConnection(request.body.passportNumber)
      .catch((e) => {
        logger.error(e);
        response.status(500).send();
      });
    response.status(200).send({id: uniqueId});
  }
);

app.get(
  '/connection/:passportNumber',
  async (request: Request, response: Response, next: NextFunction) => {
    const newConnectionService: NewConnectionService =
      new NewConnectionService();
    const connectionStatus = await newConnectionService
      .getConnectionStatus(
        request.params.passportNumber,
        request.query.activationId?.toString()
      )
      .catch((e) => {
        response.status(400).send();
      });
    response.status(200).send(connectionStatus);
  }
);

app.listen(port, () => {
  logger.info(`New Connection service running on port ${port}`);
});
