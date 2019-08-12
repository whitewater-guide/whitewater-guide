import { holdTransaction, rollbackTransaction } from '@db';
import {
  ADMIN,
  BOOM_USER_1500,
  EDITOR_NO,
  TEST_USER,
  TEST_USER_ID,
} from '@seeds/01_users';
import { NORWAY_SJOA_AMOT } from '@seeds/09_sections';
import { EDIT_SUGGESTION_ID1 } from '@seeds/17_suggestions';
import { anonContext, fakeContext, runQuery, TIMESTAMP_REGEX } from '@test';
import { ApolloErrorCodes, SuggestionStatus } from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query suggestions($page: Page, $filter: SuggestionsFilter){
    suggestions(page: $page, filter: $filter) {
      nodes {
        __typename
        id
        description
        createdAt
        createdBy {
          id
          name
        }
        status
        resolvedBy {
          id
          name
        }
        resolvedAt
        section {
          id
          name
        }
        copyright
        resolution
        image
      }
      count
    }
  }
`;

it('anon should get error', async () => {
  const result = await runQuery(query, {}, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('editor should get only suggestions from his region', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO));
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestions.count).toBe(3);
  expect(result.data.suggestions.nodes).toHaveLength(3);
});

it('user should get his suggestions', async () => {
  const result = await runQuery(
    query,
    { filter: { userId: TEST_USER_ID } },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestions.count).toBe(2);
  expect(result.data.suggestions.nodes).toHaveLength(2);
});

it('user should not get others suggested sections', async () => {
  const result = await runQuery(
    query,
    { filter: { userId: TEST_USER_ID } },
    fakeContext(BOOM_USER_1500),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('admin should get all suggestions', async () => {
  const result = await runQuery(query, {}, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestions.count).toBe(6);
  expect(result.data.suggestions.nodes).toHaveLength(6);
  expect(result.data.suggestions.nodes[0]).toEqual({
    __typename: 'Suggestion',
    copyright: null,
    createdAt: expect.stringMatching(TIMESTAMP_REGEX),
    createdBy: {
      id: TEST_USER_ID,
      name: expect.any(String),
    },
    description: 'edit suggestion 1',
    id: EDIT_SUGGESTION_ID1,
    image: null,
    resolution: null,
    resolvedAt: null,
    resolvedBy: null,
    section: {
      id: NORWAY_SJOA_AMOT,
      name: 'Amot',
    },
    status: 'pending',
  });
});

it('should filter by status', async () => {
  const result = await runQuery(
    query,
    { filter: { status: [SuggestionStatus.ACCEPTED] } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestions.count).toBe(2);
  expect(result.data.suggestions.nodes).toHaveLength(2);
});

it('should paginate', async () => {
  const result = await runQuery(
    query,
    {
      page: { offset: 1, limit: 1 },
      filter: {
        status: [SuggestionStatus.ACCEPTED, SuggestionStatus.REJECTED],
      },
    },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestions.count).toBe(4);
  expect(result.data.suggestions.nodes).toHaveLength(1);
});
