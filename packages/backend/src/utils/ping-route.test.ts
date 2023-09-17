import { createApp } from '../app';
import { koaTestAgent } from '../test/index';

it('should ping', async () => {
  const app = createApp();
  const resp = await koaTestAgent(app).get('/ping');
  expect(resp).toMatchObject({
    status: 200,
    type: 'text/plain',
    text: 'OK',
  });
});
