import * as Redis from 'ioredis';

const options: Redis.RedisOptions = {
  host: 'redis',
  lazyConnect: true,
};

export const redis = new Redis(options);
