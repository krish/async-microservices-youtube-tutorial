import {Consumer, Kafka} from 'kafkajs';
import eventProducer from './event-produce';
import logger from './logger/logger';
import {Event} from './types/event';
import IORedis from 'ioredis';
import {NewConnection} from './types/workflow.typs';
const redis = new IORedis();

const eventListner = async () => {
  //config Kafka
  const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.BROKER_URL || 'localhost:9092'],
  });
  //config consumer
  const consumer: Consumer = kafka.consumer({
    groupId: process.env.CONSUMER_GROUP || 'default',
    retry: {retries: 0},
  });
  //subscribe consumer
  await consumer
    .subscribe({
      topic: process.env.LISTEN_TOPIC || 'error',
      fromBeginning: true,
    })
    .catch((e) => logger.error(e));
  //process messages
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({topic, partition, message}) => {
      logger.debug(`new message : ${message.value?.toString()}`);
      const newMessage: Event = JSON.parse(message.value?.toString() || '{}');
      //get from redis and check
      const keyPattern: string = `codelabs:newconn-service:connrequest:${newMessage.key}:*`;
      const redisKey: string[] = await redis.keys(keyPattern);
      /** need to validate if key exsist */

      const workflow: NewConnection = new NewConnection(
        JSON.parse((await redis.get(redisKey[0])) || '{}').workflow
      );
      logger.debug(workflow, 'message from cache');

      if (newMessage.type === 'cableTV' || newMessage.type === 'fixedLine') {
        switch (newMessage.type) {
          case 'cableTV':
            workflow.history.cableTV = newMessage.result;
            break;
          case 'fixedLine':
            workflow.history.fixedLine = newMessage.result;
            break;
          default:
            break;
        }
        logger.debug(workflow, 'updated status');
        if (workflow.historyStatus()) {
          //this mean all verification pass. so continue to next step
          logger.info('all activation completed. moving to next step');
          await redis.set(redisKey[0], JSON.stringify(workflow));
          const event: Event = {
            from: process.env.SERVICE_NAME,
            type: 'VERIFICATION_COMPLETE',
            key: newMessage.key,
            result: 'pending',
          };
          await eventProducer(
            process.env.PRODUCE_TOPIC || 'error',
            event
          ).catch((e) => logger.error(e));
        } else {
          //need to store updated message
          logger.info('all activation NOT completed. waiting further');
          await redis.set(redisKey[0], JSON.stringify(workflow));
        }
      } else {
        switch (newMessage.type) {
          case 'payment-complete':
            workflow.financeApproval = 'success';
            logger.debug(workflow, ' is after payment complete');
            await redis.set(redisKey[0], JSON.stringify(workflow));
            logger.info('payment is completed. moving to activation');
            const event: Event = {
              from: process.env.SERVICE_NAME,
              type: 'FINANCE_COMPLETE',
              key: newMessage.key,
              result: 'pending',
            };
            await eventProducer(
              process.env.PRODUCE_TOPIC || 'error',
              event
            ).catch((e) => logger.error(e)); // here need to throw to avoif the offset commit
            break;
          case 'activation-complete':
            workflow.activationStatus = 'success';
            await redis.set(redisKey[0], JSON.stringify(workflow));
            logger.info('activation is completed.');
            const completeevent: Event = {
              from: process.env.SERVICE_NAME,
              type: 'ACTIVATION_COMPLETE',
              key: newMessage.key,
              result: 'pending',
            };
            await eventProducer(
              process.env.PRODUCE_TOPIC || 'error',
              completeevent
            ).catch((e) => logger.error(e)); // here need to throw to avoif the offset commit

            const newWorkflow: NewConnection = new NewConnection(
              JSON.parse((await redis.get(redisKey[0])) || '{}').workflow
            );
            logger.debug(
              newWorkflow,
              'process completed and notification sent'
            );
            //ideally record need to removed from cache and move to db. other wise if new request come it will cinflict with this
            break;

          default:
            break;
        }
      }
      await consumer.commitOffsets([
        {
          topic,
          partition,
          offset: (Number(message.offset) + 1).toString(),
        },
      ]);
    },
  });
};

export default eventListner;
