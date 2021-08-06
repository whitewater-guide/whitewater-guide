import Koa from 'koa';
import request from 'supertest';

import { getCorsMiddleware } from './cors';

const expectCors =
  (app: Koa) => (origin: string, _: any, expected: string | null) =>
    new Promise((resolve) => {
      const req = request(app.listen()).get('/').set('Origin', origin);
      if (expected === '*') {
        req
          .expect((resp) => {
            expect(resp.header).not.toContain('Access-Control-Allow-Origin');
          })
          .expect({ foo: 'bar' })
          .expect(200, resolve);
      } else if (expected === null) {
        req.expect(500, resolve);
      } else {
        req
          .expect('Access-Control-Allow-Origin', expected)
          .expect({ foo: 'bar' })
          .expect(200, resolve);
      }
    });

describe('dev environment', () => {
  const app = new Koa();
  app.silent = true;
  app.use(getCorsMiddleware(['localhost'], 'localhost:6001'));
  app.use((ctx) => {
    ctx.body = { foo: 'bar' };
  });

  it.each([
    ['/', 'denied', null],
    ['http://test.com:4000', 'denied', null],
    ['', 'allowed', '*'],
    ['http://localhost:4000', 'allowed', 'http://localhost:4000'],
    ['http://localhost', 'allowed', 'http://localhost'],
  ])('Origin "%s" should be %s', expectCors(app));
});

describe('staging environment', () => {
  const app = new Koa();
  app.silent = true;
  app.use(getCorsMiddleware(['localhost'], 'api.beta.whitewater.guide'));
  app.use((ctx) => {
    ctx.body = { foo: 'bar' };
  });

  it.each([
    ['/', 'denied', null],
    ['http://test.com:4000', 'denied', null],
    ['', 'allowed', '*'],
    ['http://localhost:4000', 'allowed', 'http://localhost:4000'],
    ['http://localhost', 'allowed', 'http://localhost'],
    [
      'http://api.beta.whitewater.guide',
      'allowed',
      'http://api.beta.whitewater.guide',
    ],
    ['http://beta.whitewater.guide', 'allowed', 'http://beta.whitewater.guide'],
    [
      'http://admin.beta.whitewater.guide',
      'allowed',
      'http://admin.beta.whitewater.guide',
    ],
  ])('Origin "%s" should be %s', expectCors(app));
});

describe('production environment', () => {
  const app = new Koa();
  app.silent = true;
  app.use(getCorsMiddleware([], 'api.whitewater.guide'));
  app.use((ctx) => {
    ctx.body = { foo: 'bar' };
  });

  it.each([
    ['/', 'denied', null],
    ['http://test.com:4000', 'denied', null],
    ['', 'allowed', '*'],
    ['http://localhost:4000', 'denied', null],
    ['http://localhost', 'denied', null],
    [
      'http://api.beta.whitewater.guide',
      'allowed',
      'http://api.beta.whitewater.guide',
    ],
    ['http://beta.whitewater.guide', 'allowed', 'http://beta.whitewater.guide'],
    [
      'http://admin.beta.whitewater.guide',
      'allowed',
      'http://admin.beta.whitewater.guide',
    ],
    ['http://api.whitewater.guide', 'allowed', 'http://api.whitewater.guide'],
    ['http://whitewater.guide', 'allowed', 'http://whitewater.guide'],
    [
      'http://admin.whitewater.guide',
      'allowed',
      'http://admin.whitewater.guide',
    ],
  ])('Origin "%s" should be %s', expectCors(app));
});
