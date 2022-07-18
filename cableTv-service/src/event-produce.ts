import {Kafka, Producer} from 'kafkajs';
import logger from './logger/logger';
import {Event} from './types/event';

const kafka: Kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.BROKER_URL || 'localhost:9092'],
});

const producer: Producer = kafka.producer();
const eventProducer = async (topic: string, payload: Event, key?: string) => {
  await producer
    .connect()
    .catch((e) => logger.error('error on connecting to Kafka', e));

  if (key) {
    await producer.send({
      topic: topic,
      messages: [{key: key, value: JSON.stringify(payload)}],
    });
  } else {
    await producer.send({
      topic: topic,
      messages: [{value: JSON.stringify(payload)}],
    });
  }
};
export default eventProducer;
