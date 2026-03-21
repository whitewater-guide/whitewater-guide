import type Koa from 'koa';
import type { SuperTest, Test } from 'supertest';
import { agent } from 'supertest';

export function koaTestAgent(app: Koa): SuperTest<Test> {
  return agent(app.listen());
}
