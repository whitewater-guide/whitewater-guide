import {
  anonContext,
  countRows,
  fakeContext,
  runQuery,
  TIMESTAMP_REGEX,
  UUID_REGEX,
} from '@test';
import {
  ApolloErrorCodes,
  MediaKind,
  SuggestionStatus,
} from '@whitewater-guide/commons';

import db, { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_NO,
  TEST_USER,
  TEST_USER_ID,
} from '~/seeds/test/01_users';
import {
  MEDIA_SUGGESTION_ID1,
  MEDIA_SUGGESTION_ID2,
} from '~/seeds/test/17_suggestions';

let mBefore: number;

beforeAll(async () => {
  [mBefore] = await countRows(true, 'media');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const upsertQuery = `
  mutation resolveSuggestion($id: ID!, $status: SuggestionStatus!) {
    resolveSuggestion(id: $id, status: $status){
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
  }
`;

const resolveSuggestion = (user?: any, status = SuggestionStatus.ACCEPTED) =>
  runQuery(
    upsertQuery,
    { id: MEDIA_SUGGESTION_ID1, status },
    user ? fakeContext(user) : anonContext(),
  );

it('anon should not pass', async () => {
  const result = await resolveSuggestion();
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('user should not pass', async () => {
  const result = await resolveSuggestion(TEST_USER);
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('non-owning editor should not pass', async () => {
  const result = await resolveSuggestion(EDITOR_GA_EC);
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('owning editor should resolve', async () => {
  const result = await resolveSuggestion(EDITOR_NO);
  expect(result.errors).toBeUndefined();
  expect(result.data.resolveSuggestion.status).toBe(SuggestionStatus.ACCEPTED);
});

it('admin should resolve', async () => {
  const result = await resolveSuggestion(ADMIN);
  expect(result.errors).toBeUndefined();
  expect(result.data.resolveSuggestion).toMatchObject({
    status: SuggestionStatus.ACCEPTED,
    resolvedAt: expect.stringMatching(TIMESTAMP_REGEX),
    resolvedBy: {
      id: ADMIN_ID,
    },
  });
});

it('should create section media when resolved', async () => {
  await resolveSuggestion(ADMIN);
  const media = await db()
    .select('*')
    .from('media_view')
    .orderBy('created_at', 'desc')
    .where({ language: 'en' })
    .first();
  expect(media).toMatchObject({
    id: expect.stringMatching(UUID_REGEX),
    kind: MediaKind.photo,
    description: 'media suggestion 1',
    url: 'media_suggestion1.jpg',
    created_by: TEST_USER_ID,
  });
});

it('should NOT create media when rejected', async () => {
  await resolveSuggestion(ADMIN, SuggestionStatus.REJECTED);
  const [mAfter] = await countRows(false, 'media');
  expect(mAfter).toBe(mBefore);
});

it('should not be able to change status back to pending', async () => {
  const result = await runQuery(
    upsertQuery,
    { id: MEDIA_SUGGESTION_ID2, status: SuggestionStatus.PENDING },
    fakeContext(ADMIN),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.MUTATION_NOT_ALLOWED);
});
