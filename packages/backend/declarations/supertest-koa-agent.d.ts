declare module 'supertest-koa-agent' {
  import Koa from 'koa';
  import { SuperTest, Test } from 'supertest';
  type Agent = (app: Koa) => SuperTest<Test>;

  const agent: Agent;
  export default agent;
}
