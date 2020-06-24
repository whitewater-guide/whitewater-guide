import { holdTransaction, rollbackTransaction } from '~/db';
import { GEORGIA_BZHUZHA_QUALI } from '~/seeds/test/09_sections';
import agent from 'supertest-koa-agent';
import { createApolloServer } from '../../apollo/server';
import { createApp } from '../../app';
import { getAccessToken } from '../../auth/jwt';
import { BOOM_USER_1500_ID } from '~/seeds/test/01_users';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation upsertLogbookDescent(
    $descent: LogbookDescentInput!
    $shareToken: String
  ) {
    upsertLogbookDescent(descent: $descent, shareToken: $shareToken) {
      userId

      startedAt
      duration
      level {
        value
        unit
      }
      comment
      public

      upstreamData

      section {
        region
        river
        section
        difficulty
        putIn {
          lat
          lng
        }
        takeOut {
          lat
          lng
        }

        upstreamId
        upstreamData
        upstreamSection {
          id
          river {
            id
            name
          }
          name
          difficulty
        }
      }
    }
  }
`;

const query = `
query listLogbookDescents($filter: LogbookDescentsFilter, $page: Page) {
  logbookDescents(filter: $filter, page: $page) {
    edges {
      node {
        userId

        startedAt
        duration
        level {
          value
          unit
        }
        comment
        public

        upstreamData

        section {
          region
          river
          section
          difficulty
          putIn {
            lat
            lng
          }
          takeOut {
            lat
            lng
          }

          upstreamId
          upstreamData
          upstreamSection {
            id
            river {
              id
              name
            }
            name
            difficulty
          }
        }
      }
      cursor
    }
    pageInfo {
      endCursor
      hasMore
    }
  }
}
`;

const descent = {
  section: {
    region: 'Georgia',
    river: 'Bzhuzha',
    section: 'Lower',
    difficulty: 2,
    upstreamId: GEORGIA_BZHUZHA_QUALI,
  },
  startedAt: new Date(2000, 1, 1),
  duration: 3600,
  comment: 'comment',
  level: {
    value: 20,
    unit: 'cfs',
  },
  public: true,
  upstreamData: { foo: 'bar' },
};

it('user should put and anon should get logbook entry', async () => {
  const app = createApp();
  await createApolloServer(app);
  const testAgent = agent(app);
  const token = getAccessToken(BOOM_USER_1500_ID);
  const response = await testAgent
    .post('/graphql')
    .set('authorization', `bearer ${token}`)
    .send({
      operationName: 'upsertLogbookDescent',
      query: mutation,
      variables: { descent },
    });

  expect(response.status).toBe(200);
  expect(response.body).toMatchSnapshot('user creates');

  const response2 = await testAgent.post('/graphql').send({
    operationName: 'listLogbookDescents',
    query,
    variables: {},
  });

  expect(response2.status).toBe(200);
  expect(response2.body).toMatchSnapshot('anon reads');
});
