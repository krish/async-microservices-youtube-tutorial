import pino from 'pino';
import dayjs from 'dayjs';

const logger = pino({
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'trace',
  timestamp: () => `,"time": "${dayjs().format()}"`,
});
export default logger;
