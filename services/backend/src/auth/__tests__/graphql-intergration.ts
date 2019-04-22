import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { ADMIN, ADMIN_FB_PROFILE, ADMIN_ID } from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { GALICIA_REGION_DESCR_BANNER2 } from '@seeds/14_banners';
import jsonwebtoken from 'jsonwebtoken';
import Koa from 'koa';
import FacebookTokenStrategy from 'passport-facebook-token';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import { createApolloServer } from '../../apollo/server';
import { createApp } from '../../app';
import { getRefreshToken } from '../jwt';

const TEST_QUERY = {
  operationName: 'testQuery',
  query: `query testQuery {
        me {
          id
          name
          admin
        }
        region(id: "${REGION_GALICIA}") {
          id
          name
        }
      }
    `,
};
const ADMIN_RESPONSE = {
  data: {
    me: {
      id: ADMIN.id,
      name: ADMIN.name,
      admin: true,
    },
    region: {
      id: REGION_GALICIA,
      name: 'Galicia',
    },
  },
};
const ANON_RESPONSE = {
  data: {
    me: null,
    region: {
      id: REGION_GALICIA,
      name: 'Galicia',
    },
  },
};
const TEST_MUTATION = {
  operationName: 'testMutation',
  query: `mutation testMutation {
    removeBanner(id: "${GALICIA_REGION_DESCR_BANNER2}") {
      id
      deleted
    }
  }
`,
};
const MUTATION_RESPONSE = {
  data: {
    removeBanner: {
      id: GALICIA_REGION_DESCR_BANNER2,
      deleted: true,
    },
  },
};

let app: Koa;

beforeEach(async () => {
  jest.resetAllMocks();
  FacebookTokenStrategy.prototype.userProfile = jest.fn(
    (accessToken: string, done: any) => {
      done(null, ADMIN_FB_PROFILE);
    },
  );
  await holdTransaction();
  await asyncRedis.flushall();
  app = createApp();
  await createApolloServer(app);
});

afterEach(async () => {
  await rollbackTransaction();
  client.removeAllListeners();
});

describe('legacy', () => {
  const ROUTE = '/auth/facebook/token?access_token=__existing_access_token__';

  it('should return my profile', async () => {
    const testAgent = agent(app);
    await testAgent.get(ROUTE);
    const response = await testAgent.post('/graphql').send(TEST_QUERY);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(ADMIN_RESPONSE);
  });

  it('should mutate', async () => {
    const testAgent = agent(app);
    await testAgent.get(ROUTE);
    const response = await testAgent.post('/graphql').send(TEST_MUTATION);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(MUTATION_RESPONSE);
  });
});

describe('facebook', () => {
  describe('mobile', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const testAgent = agent(app);
      const resp = await testAgent.get(
        '/auth/facebook/signin?access_token=__existing_access_token__',
      );
      accessToken = resp.body.accessToken;
      refreshToken = resp.body.refreshToken;
    });

    it('should return my profile', async () => {
      const testAgent = agent(app);
      const response = await testAgent
        .post('/graphql')
        .set('authorization', `bearer ${accessToken}`)
        .send(TEST_QUERY);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(ADMIN_RESPONSE);
    });

    it('should mutate', async () => {
      const testAgent = agent(app);
      const response = await testAgent
        .post('/graphql')
        .set('authorization', `bearer ${accessToken}`)
        .send(TEST_MUTATION);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(MUTATION_RESPONSE);
    });
  });

  describe('web', () => {
    let testAgent: SuperTest<Test>;

    beforeEach(async () => {
      testAgent = agent(app);
      await testAgent.get(
        '/auth/facebook/signin?web=true&access_token=__existing_access_token__',
      );
    });

    it('should return my profile', async () => {
      const response = await testAgent.post('/graphql').send(TEST_QUERY);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(ADMIN_RESPONSE);
    });

    it('should mutate', async () => {
      const response = await testAgent.post('/graphql').send(TEST_MUTATION);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(MUTATION_RESPONSE);
    });
  });
});

it('should work for anonymous', async () => {
  const testAgent = agent(app);
  const response = await testAgent.post('/graphql').send(TEST_QUERY);

  expect(response.status).toBe(200);
  expect(response.body).toEqual(ANON_RESPONSE);
});

it('should not work when refresh token is used as access token', async () => {
  const refreshToken = getRefreshToken(ADMIN_ID);
  const testAgent = agent(app);
  const response = await testAgent
    .post('/graphql')
    .set('authorization', `bearer ${refreshToken}`)
    .send(TEST_QUERY);
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: 'unauthenticated',
    error_id: expect.any(String),
  });
});

it('should not work when access token expired', async () => {
  const accessToken = jsonwebtoken.sign(
    { id: ADMIN_ID, iat: Math.floor(Date.now() / 1000) - 60 * 20 },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '10m' },
  );
  const testAgent = agent(app);
  const response = await testAgent
    .post('/graphql')
    .set('authorization', `bearer ${accessToken}`)
    .send(TEST_QUERY);
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: 'jwt.expired',
  });
});
