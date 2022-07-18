import IORedis from 'ioredis';
import logger from '../logger/logger';
import {v4 as uuidv4} from 'uuid';
import eventProducer from '../event-produce';
import {Event} from '../types/event';
import {NewConnection} from '../types/workflow.typs';

const redis = new IORedis();

export class NewConnectionService {
  async getConnectionStatus(
    passportNumber: string,
    activationId: string | undefined
  ) {
    const redisKey: string = `codelabs:newconn-service:connrequest:${passportNumber}:${activationId}`;
    const connection: string | null = await redis.get(redisKey);
    logger.debug(connection, ' cached output');
    if (connection) {
      return connection;
    } else {
      throw new Error('invalid parameters');
    }
  }
  async initiateNewConnection(passportNumber: string): Promise<string> {
    const workflow: NewConnection = new NewConnection({
      history: {cableTV: 'pending', fixedLine: 'pending'},
      financeApproval: 'pending',
      activationStatus: 'pending',
    });

    const uniqueKey = uuidv4();

    const redisKey: string = `codelabs:newconn-service:connrequest:${passportNumber}:${uniqueKey}`;
    await redis
      .set(redisKey, JSON.stringify(workflow))
      .catch((e) => logger.error(e));
    //emmit message to verification listners
    const event: Event = {
      from: process.env.SERVICE_NAME,
      type: 'NEW_CONNECTION',
      key: passportNumber,
      result: 'pending',
    };
    await eventProducer(process.env.PRODUCE_TOPIC || 'error', event).catch(
      (e) => logger.error(e)
    );

    return uniqueKey;
  }
}
