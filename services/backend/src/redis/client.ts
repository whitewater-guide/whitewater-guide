import Redis from 'ioredis';
import log from '../log';

const logger = log.child({ module: 'redis' });

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
});

redis.on('ready', () => logger.info('Redis client ready'));
redis.on('connect', () => logger.info('Redis client connected'));
redis.on('reconnecting', () => logger.info('Redis client reconnecting'));
redis.on('end', () => logger.info('Redis client ended'));
redis.on('error', (error) =>
  logger.error({ error, message: 'Redis client error' }),
);
