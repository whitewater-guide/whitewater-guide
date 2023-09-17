import jwt from 'jsonwebtoken';
import type Koa from 'koa';
import FacebookTokenStrategy from 'passport-facebook-token';
import type { SuperTest, Test } from 'supertest';

import { createApolloServer } from '../../apollo/server/index';
import { createApp } from '../../app';
import config from '../../config';
import { holdTransaction, rollbackTransaction } from '../../db/index';
import { ADMIN, ADMIN_FB_PROFILE, ADMIN_ID } from '../../seeds/test/01_users';
import { REGION_GALICIA } from '../../seeds/test/04_regions';
import { GALICIA_REGION_DESCR_BANNER2 } from '../../seeds/test/14_banners';
import { koaTestAgent } from '../../test/index';
import { getRefreshToken } from '../jwt/index';

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
  app = createApp();
  await createApolloServer(app);
});

afterEach(async () => {
  await rollbackTransaction();
});

describe('facebook', () => {
  describe('mobile', () => {
    let accessToken: string;

    beforeEach(async () => {
      const testAgent = koaTestAgent(app);
      const resp = await testAgent.get(
        '/auth/facebook/signin?access_token=__existing_access_token__',
      );
      accessToken = resp.body.accessToken;
    });

    it('should return my profile', async () => {
      const testAgent = koaTestAgent(app);
      const response = await testAgent
        .post('/graphql')
        .set('authorization', `bearer ${accessToken}`)
        .send(TEST_QUERY);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(ADMIN_RESPONSE);
    });

    it('should mutate', async () => {
      const testAgent = koaTestAgent(app);
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
      testAgent = koaTestAgent(app);
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
  const testAgent = koaTestAgent(app);
  const response = await testAgent.post('/graphql').send(TEST_QUERY);

  expect(response.status).toBe(200);
  expect(response.body).toEqual(ANON_RESPONSE);
});

it('should not work when refresh token is used as access token', async () => {
  const refreshToken = getRefreshToken(ADMIN_ID);
  const testAgent = koaTestAgent(app);
  const response = await testAgent
    .post('/graphql')
    .set('authorization', `bearer ${refreshToken}`)
    .send(TEST_QUERY);
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: 'jwt.unauthenticated',
    error_id: expect.any(String),
  });
});

it('should not work when access token expired', async () => {
  const accessToken = jwt.sign(
    { id: ADMIN_ID, iat: Math.floor(Date.now() / 1000) - 60 * 20 },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: '10m' },
  );
  const testAgent = koaTestAgent(app);
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
