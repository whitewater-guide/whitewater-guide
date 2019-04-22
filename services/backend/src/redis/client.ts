import redis from 'redis';
import log from '../log';

const logger = log.child({ module: 'redis' });

export const client = redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
});

client.on('ready', () => logger.info('Redis client ready'));
client.on('connect', () => logger.info('Redis client connected'));
client.on('reconnecting', () => logger.info('Redis client reconnecting'));
client.on('end', () => logger.info('Redis client ended'));
client.on('error', (error) =>
  logger.error({ error, message: 'Redis client error' }),
);
client.on('warning', (warning) =>
  logger.warn({ message: 'Redis client warning', extra: { warning } }),
);
