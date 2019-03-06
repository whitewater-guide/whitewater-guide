import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { ADMIN } from '@seeds/01_users';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApolloServer } from '../../../apollo/server';
import { createApp } from '../../../app';

const ROUTE = '/auth/facebook/token';

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

it('should return my profile', async () => {
  const testAgent = agent(app);
  const req = testAgent.get(`${ROUTE}?access_token=__existing_access_token__`);
  try {
    await req;
  } catch (err) {
    // ignore redirect
  }
  const response = await testAgent.post('/graphql').send({
    operationName: 'myProfile',
    query: `query myProfile {
        me {
          id
          name
          admin
        }
      }
    `,
  });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    data: {
      me: {
        id: ADMIN.id,
        name: ADMIN.name,
        admin: true,
      },
    },
  });
});
