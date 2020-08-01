import { holdTransaction, rollbackTransaction } from '~/db';
import { EDITOR_GA_EC, EDITOR_NO, TEST_USER } from '~/seeds/test/01_users';
import { SUGGESTED_SECTION_ID1 } from '~/seeds/test/17_suggestions';
import { anonContext, fakeContext, runQuery } from '~/test';
import { ApolloErrorCodes, SuggestionStatus } from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  mutation rejectSuggestedSection($id: ID!) {
    rejectSuggestedSection(id: $id) {
      id
      status
    }
  }
`;

it('anon should not pass', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('user should not pass', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(TEST_USER),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('non-owning editor should not pass', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(EDITOR_GA_EC),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('owning editor should resolve', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(EDITOR_NO),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.rejectSuggestedSection).toMatchObject({
    id: SUGGESTED_SECTION_ID1,
    status: SuggestionStatus.REJECTED,
  });
});

it('admin should resolve', async () => {
  const result = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(EDITOR_NO),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.rejectSuggestedSection).toMatchObject({
    id: SUGGESTED_SECTION_ID1,
    status: SuggestionStatus.REJECTED,
  });
});
