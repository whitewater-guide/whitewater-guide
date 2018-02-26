import * as pino from 'pino';

const log = pino({
  name: 'swapp',
  level: process.env.API_LOG_LEVEL,
  enabled: process.env.NODE_ENV !== 'test',
});

export default log;
