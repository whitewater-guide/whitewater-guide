import { promisify } from 'util';
import { client } from './client';

const keys = promisify(client.keys);
const get = promisify(client.get);
const hget = promisify(client.hget);
const hgetall = promisify(client.hgetall);
const flushall = promisify(client.flushall);

export const asyncRedis = {
  keys: keys.bind(client) as typeof  keys,
  get: get.bind(client) as typeof  get,
  hget: hget.bind(client) as typeof  hget,
  hgetall: hgetall.bind(client) as typeof  hgetall,
  flushall: flushall.bind(client) as typeof  flushall,
};
