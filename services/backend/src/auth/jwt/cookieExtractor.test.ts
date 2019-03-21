import Koa from 'koa';
import supertest from 'supertest';
import cookieJWTExtractor from './cookie-jwt-extractor';

const extractor = cookieJWTExtractor('foo');

it('should extract cookie', async () => {
  const app = new Koa();
  let req: any;
  app.use((ctx) => {
    req = ctx.request;
    ctx.body = 'OK';
  });
  const agent = supertest(app.callback());
  await agent
    .get('/')
    .set('Cookie', ['baz=foo; Max-Age=2000', 'foo=bar; Max-Age=1000']);
  expect(extractor(req)).toBe('bar');
});
