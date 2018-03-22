import pino from 'pino';

const log = pino({
  level: process.env.LOG_LEVEL,
  prettyPrint: process.env.NODE_ENV === 'development' ? {
    forceColor: true,
    levelFirst: true,
  } : false,
});

export default log;
