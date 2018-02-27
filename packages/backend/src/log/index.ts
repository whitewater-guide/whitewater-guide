import * as pino from 'pino';

const log = pino({
  name: 'ww',
  level: process.env.BACK_LOG_LEVEL,
  enabled: process.env.NODE_ENV !== 'test',
});

export default log;
