import pino from 'pino';

const log = pino({
  level: process.env.LOG_LEVEL,
  prettyPrint: process.env.NODE_ENV === 'development' ? {
    colorize: true,
    levelFirst: true,
  } as any : false,
});

export default log;
