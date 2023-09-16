import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { MediaKind, SuggestionStatus } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_NO,
  TEST_USER,
  TEST_USER_ID,
} from '../../../seeds/test/01_users';
import {
  MEDIA_SUGGESTION_ID1,
  MEDIA_SUGGESTION_ID2,
} from '../../../seeds/test/17_suggestions';
import { countRows, fakeContext } from '../../../test/index';
import { UUID_REGEX } from '../../../utils/index';
import { testResolveSuggestion } from './resolveSuggestion.test.generated';

let mBefore: number;

beforeAll(async () => {
  [mBefore] = await countRows(true, 'media');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation resolveSuggestion($id: ID!, $status: SuggestionStatus!) {
    resolveSuggestion(id: $id, status: $status) {
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

it('anon should not pass', async () => {
  const result = await testResolveSuggestion({
    id: MEDIA_SUGGESTION_ID1,
    status: SuggestionStatus.Accepted,
  });
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('user should not pass', async () => {
  const result = await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID1, status: SuggestionStatus.Accepted },
    fakeContext(TEST_USER),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('non-owning editor should not pass', async () => {
  const result = await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID1, status: SuggestionStatus.Accepted },
    fakeContext(EDITOR_GA_EC),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('owning editor should resolve', async () => {
  const result = await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID1, status: SuggestionStatus.Accepted },
    fakeContext(EDITOR_NO),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.resolveSuggestion?.status).toBe(
    SuggestionStatus.Accepted,
  );
});

it('admin should resolve', async () => {
  const result = await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID1, status: SuggestionStatus.Accepted },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.resolveSuggestion).toMatchObject({
    status: SuggestionStatus.Accepted,
    resolvedAt: expect.any(Date),
    resolvedBy: {
      id: ADMIN_ID,
    },
  });
});

it('should create section media when resolved', async () => {
  await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID1, status: SuggestionStatus.Accepted },
    fakeContext(ADMIN),
  );
  const media = await db()
    .select('*')
    .from('media_view')
    .orderBy('created_at', 'desc')
    .where({ language: 'en' })
    .first();
  expect(media).toMatchObject({
    id: expect.stringMatching(UUID_REGEX),
    kind: MediaKind.Photo,
    description: 'media suggestion 1',
    url: 'media_suggestion1.jpg',
    created_by: TEST_USER_ID,
  });
});

it('should NOT create media when rejected', async () => {
  await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID1, status: SuggestionStatus.Rejected },
    fakeContext(ADMIN),
  );
  const [mAfter] = await countRows(false, 'media');
  expect(mAfter).toBe(mBefore);
});

it('should not be able to change status back to pending', async () => {
  const result = await testResolveSuggestion(
    { id: MEDIA_SUGGESTION_ID2, status: SuggestionStatus.Pending },
    fakeContext(ADMIN),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.MUTATION_NOT_ALLOWED);
});
