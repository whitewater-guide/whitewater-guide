import { holdTransaction, rollbackTransaction } from '@db';
import {
  EDITOR_GA_EC,
  EDITOR_NO,
  TEST_USER,
  TEST_USER_ID,
} from '@seeds/01_users';
import { REGION_NORWAY } from '@seeds/04_regions';
import { SUGGESTED_SECTION_ID1 } from '@seeds/17_suggestions';
import { anonContext, fakeContext, runQuery } from '@test';
import {
  ApolloErrorCodes,
  NEW_ID,
  SuggestionStatus,
} from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query suggestedSection($id: ID){
    suggestedSection(id: $id) {
      __typename
      status
      region {
        id
        name
      }
      river {
        id
        name
      }
      name
      section
    }
  }
`;

it('anon should get error', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('author should get error', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(TEST_USER),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('non-owning editor should get error', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(EDITOR_GA_EC),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('owning editor should get data', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(EDITOR_NO),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSection).toMatchObject({
    __typename: 'SuggestedSection',
    name: 'Upper',
    region: {
      id: REGION_NORWAY,
      name: 'Norway',
    },
    river: {
      id: NEW_ID,
      name: 'Driva',
    },
    section: {
      createdBy: TEST_USER_ID,
      difficulty: 4,
      id: null,
      name: 'Upper',
    },
    status: SuggestionStatus.PENDING,
  });
});

it('should return null when id is not provided', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO));
  expect(result.errors).toBeUndefined();
  expect(result.data.suggestedSection).toBeNull();
});
