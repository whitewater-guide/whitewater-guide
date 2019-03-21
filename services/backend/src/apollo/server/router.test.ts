import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApp } from '../../app';
import { createApolloServer } from './server';

let app: Koa;

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  await asyncRedis.flushall();
  app = createApp();
  await createApolloServer(app);
});

afterEach(async () => {
  await rollbackTransaction();
  client.removeAllListeners();
});

it('should expose schema.json', async () => {
  const resp = await agent(app).get('/graphql/schema.json');
  expect(resp.status).toBe(200);
  expect(() => JSON.parse(resp.text)).not.toThrow();
  expect(resp.text).toEqual(expect.stringContaining('Query'));
});

it('should expose typedefs.txt', async () => {
  const resp = await agent(app).get('/graphql/typedefs.txt');
  expect(resp.status).toBe(200);
  expect(resp.text).toEqual(expect.stringContaining('type Query'));
});
