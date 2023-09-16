declare module 'supertest-koa-agent' {
  import type Koa from 'koa';
  import type { SuperTest, Test } from 'supertest';

  type Agent = (app: Koa) => SuperTest<Test>;

  const agent: Agent;
  export default agent;
}
