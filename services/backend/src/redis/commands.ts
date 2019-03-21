import { Commands } from 'redis';
import { promisify } from 'util';
import { client } from './client';

const keys = promisify(client.keys);
const get = promisify(client.get);
const hget = promisify(client.hget);
const hgetall = promisify(client.hgetall);
const flushall = promisify(client.flushall);
const quit = promisify(client.quit);
const set = promisify(client.set);

export const asyncRedis = {
  keys: keys.bind(client) as typeof keys,
  get: get.bind(client) as typeof get,
  hget: hget.bind(client) as typeof hget,
  hgetall: hgetall.bind(client) as typeof hgetall,
  flushall: flushall.bind(client) as typeof flushall,
  quit: quit.bind(client) as typeof quit,
  set: set.bind(client) as Commands<Promise<'OK'>>['set'],
};
