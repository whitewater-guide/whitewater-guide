import type Koa from 'koa';
import agent from 'supertest-koa-agent';

import { createApolloServer } from '../../../apollo/server/index';
import { createApp } from '../../../app';
import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { MailType, sendMail } from '../../../mail/index';

let app: Koa;

jest.mock('../../../mail');

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
  await createApolloServer(app);
});

afterEach(async () => {
  await rollbackTransaction();
});

it('should respond with 401 unathorized when API key is not provided', async () => {
  const testAgent = agent(app);
  const response = await testAgent.post('/gorge/health').send([
    {
      id: '2f915d20-ffe6-11e8-8919-9f370230d1ae',
      script: 'chile',
      lastRun: '2021-12-13T07:57:59Z',
    },
    {
      id: 'e3c0c89a-7c72-11e9-8abd-cfc3ab2b843d',
      script: 'quebec',
      lastRun: '2021-12-13T07:57:00Z',
    },
  ]);
  expect(response.status).toBe(401);
});

it('should send email and respond with OK', async () => {
  const testAgent = agent(app);
  const response = await testAgent
    .post('/gorge/health')
    .set('X-API-KEY', '__test_gorge_health_key__')
    .set('Host', 'api.local')
    .send([
      {
        id: '2f915d20-ffe6-11e8-8919-9f370230d1ae',
        script: 'chile',
        lastRun: '2021-12-13T07:57:59Z',
      },
      {
        id: 'e3c0c89a-7c72-11e9-8abd-cfc3ab2b843d',
        script: 'quebec',
        lastRun: '2021-12-13T07:57:00Z',
      },
    ]);
  expect(response.status).toBe(200);
  expect(response.text).toEqual('Acknowledged');
  expect(sendMail).toHaveBeenCalledWith(
    MailType.GORGE_UNHEALTHY,
    ['test1@yandex.ru', 'test2@whitewater.guide'],
    {
      unhealthyMsg: expect.stringContaining('quebec'),
    },
  );
});

it('should not send email when jobs array is empty', async () => {
  const testAgent = agent(app);
  const response = await testAgent
    .post('/gorge/health')
    .set('X-API-KEY', '__test_gorge_health_key__')
    .set('Host', 'api.local')
    .send([]);
  expect(response.status).toBe(200);
  expect(response.text).toEqual('Acknowledged');
  expect(sendMail).not.toHaveBeenCalled();
});
