import agent from 'supertest-koa-agent';
import { createApp } from '../app';

it('should ping', async () => {
  const app = createApp();
  const resp = await agent(app).get('/ping');
  expect(resp).toMatchObject({
    status: 200,
    type: 'text/plain',
    text: 'OK',
  });
});
