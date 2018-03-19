import * as Redis from 'ioredis';

const options: Redis.RedisOptions = {
  host: 'redis',
  lazyConnect: true,
};

export const redis = new Redis(options);

export const LastOpNS = 'lastOp'; // Status of last harvest operation, success, count, error per source and gauge
export const LastMeasurementsNs = 'lastMeasurements'; // Last timestamp, flow, level per gauge
