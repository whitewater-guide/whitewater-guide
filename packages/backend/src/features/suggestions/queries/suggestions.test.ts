import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { SuggestionStatus } from '@whitewater-guide/schema';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  BOOM_USER_1500,
  EDITOR_NO,
  TEST_USER,
  TEST_USER_ID,
} from '~/seeds/test/01_users';
import { NORWAY_SJOA_AMOT } from '~/seeds/test/09_sections';
import { EDIT_SUGGESTION_ID1 } from '~/seeds/test/17_suggestions';

import { testSuggestions } from './suggestions.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query suggestions($page: Page, $filter: SuggestionsFilter) {
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
  const result = await testSuggestions({}, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('editor should get only suggestions from his region', async () => {
  const result = await testSuggestions({}, fakeContext(EDITOR_NO));
  expect(result.errors).toBeUndefined();
  expect(result.data?.suggestions?.count).toBe(3);
  expect(result.data?.suggestions?.nodes).toHaveLength(3);
});

it('user should get his suggestions', async () => {
  const result = await testSuggestions(
    { filter: { userId: TEST_USER_ID } },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.suggestions?.count).toBe(2);
  expect(result.data?.suggestions?.nodes).toHaveLength(2);
});

it('user should not get others suggested sections', async () => {
  const result = await testSuggestions(
    { filter: { userId: TEST_USER_ID } },
    fakeContext(BOOM_USER_1500),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('admin should get all suggestions', async () => {
  const result = await testSuggestions({}, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.suggestions?.count).toBe(6);
  expect(result.data?.suggestions?.nodes).toHaveLength(6);
  expect(result.data?.suggestions?.nodes[0]).toEqual({
    __typename: 'Suggestion',
    copyright: null,
    createdAt: expect.any(Date),
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
  const result = await testSuggestions(
    { filter: { status: [SuggestionStatus.Accepted] } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.suggestions?.count).toBe(2);
  expect(result.data?.suggestions?.nodes).toHaveLength(2);
});

it('should paginate', async () => {
  const result = await testSuggestions(
    {
      page: { offset: 1, limit: 1 },
      filter: {
        status: [SuggestionStatus.Accepted, SuggestionStatus.Rejected],
      },
    },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.suggestions?.count).toBe(4);
  expect(result.data?.suggestions?.nodes).toHaveLength(1);
});
