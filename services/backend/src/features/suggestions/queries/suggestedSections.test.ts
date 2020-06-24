import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  BOOM_USER_1500,
  EDITOR_NO,
  TEST_USER,
  TEST_USER_ID,
} from '~/seeds/test/01_users';
import { REGION_NORWAY } from '~/seeds/test/04_regions';
import { anonContext, fakeContext, runQuery, TIMESTAMP_REGEX } from '~/test';
import {
  ApolloErrorCodes,
  NEW_ID,
  SuggestionStatus,
} from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query suggestedSections($page: Page, $filter: SuggestionsFilter){
    suggestedSections(page: $page, filter: $filter) {
      nodes {
        __typename
        status
        createdAt
        createdBy {
          id
          name
        }
        region {
          id
          name
        }
        river {
          id
          name
        }
        name
      }
      count
    }
  }
`;

it('anon should get error', async () => {
  const result = await runQuery(query, {}, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('editor should get only suggested sections from his region', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO));
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSections.count).toBe(1);
  expect(result.data.suggestedSections.nodes).toHaveLength(1);
});

it('user should get his suggestedSections', async () => {
  const result = await runQuery(
    query,
    { filter: { userId: TEST_USER_ID } },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSections.count).toBe(1);
  expect(result.data.suggestedSections.nodes).toHaveLength(1);
  expect(result.data.suggestedSections.nodes[0].name).toEqual('Upper');
});

it('user should not get others suggested sections', async () => {
  const result = await runQuery(
    query,
    { filter: { userId: TEST_USER_ID } },
    fakeContext(BOOM_USER_1500),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('admin should get all suggested sections', async () => {
  const result = await runQuery(query, {}, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSections.count).toBe(2);
  expect(result.data.suggestedSections.nodes).toHaveLength(2);
  expect(result.data.suggestedSections.nodes[0]).toEqual({
    __typename: 'SuggestedSection',
    status: SuggestionStatus.PENDING,
    region: {
      id: REGION_NORWAY,
      name: 'Norway',
    },
    river: {
      id: NEW_ID,
      name: 'Driva',
    },
    name: 'Upper',
    createdAt: expect.stringMatching(TIMESTAMP_REGEX),
    createdBy: {
      id: TEST_USER_ID,
      name: expect.any(String),
    },
  });
});

it('should filter by status', async () => {
  const result = await runQuery(
    query,
    { filter: { status: [SuggestionStatus.ACCEPTED] } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSections.count).toBe(1);
  expect(result.data.suggestedSections.nodes).toHaveLength(1);
});

it('should paginate', async () => {
  const result = await runQuery(
    query,
    {
      page: { offset: 1, limit: 1 },
    },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSections.count).toBe(2);
  expect(result.data.suggestedSections.nodes).toHaveLength(1);
  expect(result.data.suggestedSections.nodes[0].name).toEqual('Supsa');
});
