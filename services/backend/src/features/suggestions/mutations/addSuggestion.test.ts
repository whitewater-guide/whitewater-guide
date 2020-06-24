import db, { holdTransaction, rollbackTransaction } from '~/db';
import {
  fileExistsInBucket,
  MEDIA,
  resetTestMinio,
  TEMP_BUCKET_DIR,
} from '~/minio';
import {
  BOOM_USER_1500,
  BOOM_USER_1500_ID,
  EDITOR_GE,
  EDITOR_GE_ID,
} from '~/seeds/test/01_users';
import { GEORGIA_BZHUZHA_EXTREME } from '~/seeds/test/09_sections';
import {
  anonContext,
  countRows,
  fakeContext,
  runQuery,
  TIMESTAMP_REGEX,
  UUID_REGEX,
} from '~/test';
import {
  MediaKind,
  SuggestionInput,
  SuggestionStatus,
} from '@whitewater-guide/commons';
import { copy } from 'fs-extra';
import * as path from 'path';

const { PROTOCOL, MINIO_DOMAIN } = process.env;

let sBefore: number;
let mBefore: number;

beforeAll(async () => {
  [sBefore, mBefore] = await countRows(true, 'suggestions', 'media');
});

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
  await copy(
    path.resolve(__dirname, '__tests__/test.jpg'),
    path.resolve(TEMP_BUCKET_DIR, 'suggested_media.jpg'),
  );
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

const upsertQuery = `
  mutation addSuggestion($suggestion: SuggestionInput!) {
    addSuggestion(suggestion: $suggestion){
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

const withMedia: SuggestionInput = {
  section: { id: GEORGIA_BZHUZHA_EXTREME },
  description: 'foobar',
  copyright: 'copyleft',
  filename: `${PROTOCOL}://${MINIO_DOMAIN}/temp/suggested_media.jpg`,
  resolution: [100, 100],
};

const withoutMedia: SuggestionInput = {
  section: { id: GEORGIA_BZHUZHA_EXTREME },
  description: 'foobar',
  copyright: null,
  filename: null,
  resolution: null,
};

const addSuggestion = (suggestion: SuggestionInput, user = BOOM_USER_1500) =>
  runQuery(upsertQuery, { suggestion }, fakeContext(user));

it('anon should not fail with media', async () => {
  const result = await runQuery(
    upsertQuery,
    { suggestion: withMedia },
    anonContext(),
  );
  expect(result.errors).toBeUndefined();
});

it('should fail for invalid input', async () => {
  const result = await runQuery(
    upsertQuery,
    {
      suggestion: {
        section: { id: 'foo' },
        description: 'foobar',
        copyright: null,
        filename: null,
        resolution: [100, 100, 100],
      },
    },
    anonContext(),
  );
  expect(result).toHaveGraphqlValidationError();
});

describe('regular user', () => {
  it('should not fail with media', async () => {
    const result = await addSuggestion(withMedia);
    expect(result.errors).toBeUndefined();
  });

  it('should not fail without media', async () => {
    const result = await addSuggestion(withoutMedia);
    expect(result.errors).toBeUndefined();
  });

  it('should add one more suggestion', async () => {
    await addSuggestion(withMedia);
    const [sAfter] = await countRows(false, 'suggestions');
    expect(sAfter - sBefore).toBe(1);
  });

  it('should return result', async () => {
    const result = await addSuggestion(withMedia);
    const inserted = result && result.data && result.data.addSuggestion;
    expect(inserted).toEqual({
      __typename: 'Suggestion',
      id: expect.stringMatching(UUID_REGEX),
      description: 'foobar',
      createdAt: expect.stringMatching(TIMESTAMP_REGEX),
      createdBy: {
        id: BOOM_USER_1500_ID,
        name: BOOM_USER_1500.name,
      },
      status: SuggestionStatus.PENDING,
      resolvedBy: null,
      resolvedAt: null,
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        name: 'Extreme race',
      },
      copyright: 'copyleft',
      resolution: [100, 100],
      image: `${PROTOCOL}://${MINIO_DOMAIN}/media/suggested_media.jpg`,
    });
  });

  it('should move temp file to media bucket', async () => {
    await addSuggestion(withMedia);
    await expect(
      fileExistsInBucket(
        MEDIA,
        'suggested_media.jpg',
        'a1c4720fa8526d4a8560dd1cb29c0ea7',
      ),
    ).resolves.toBe(true);
  });

  it('should not create media', async () => {
    await addSuggestion(withMedia);
    const [mAfter] = await countRows(false, 'media');
    expect(mAfter).toBe(mBefore);
  });
});

describe('editor', () => {
  it("should auto-approve editor's media suggestions", async () => {
    const { data, errors } = await addSuggestion(withMedia, EDITOR_GE);
    expect(errors).toBeUndefined();
    const inserted = data && data.addSuggestion;
    expect(inserted).toEqual({
      __typename: 'Suggestion',
      id: expect.stringMatching(UUID_REGEX),
      description: 'foobar',
      createdAt: expect.stringMatching(TIMESTAMP_REGEX),
      createdBy: {
        id: EDITOR_GE_ID,
        name: EDITOR_GE.name,
      },
      status: SuggestionStatus.ACCEPTED,
      resolvedBy: {
        id: EDITOR_GE_ID,
        name: EDITOR_GE.name,
      },
      resolvedAt: expect.stringMatching(TIMESTAMP_REGEX),
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        name: 'Extreme race',
      },
      copyright: 'copyleft',
      resolution: [100, 100],
      image: `${PROTOCOL}://${MINIO_DOMAIN}/media/suggested_media.jpg`,
    });
  });

  it("should convert editor's suggestion to media", async () => {
    await addSuggestion(withMedia, EDITOR_GE);
    const media = await db()
      .select('*')
      .from('media_view')
      .where({ language: 'en' })
      .orderBy('created_at', 'desc')
      .first();
    expect(media).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      kind: MediaKind.photo,
      description: 'foobar',
      url: 'suggested_media.jpg',
      created_by: EDITOR_GE_ID,
    });
  });

  it('should move temp file to media bucket', async () => {
    await addSuggestion(withMedia, EDITOR_GE);
    await expect(
      fileExistsInBucket(
        MEDIA,
        'suggested_media.jpg',
        'a1c4720fa8526d4a8560dd1cb29c0ea7',
      ),
    ).resolves.toBe(true);
  });

  it("should NOT auto-approve editor's text suggestions", async () => {
    const { data, errors } = await addSuggestion(withoutMedia, EDITOR_GE);
    expect(errors).toBeUndefined();
    const inserted = data && data.addSuggestion;
    expect(inserted).toEqual({
      __typename: 'Suggestion',
      id: expect.stringMatching(UUID_REGEX),
      description: 'foobar',
      createdAt: expect.stringMatching(TIMESTAMP_REGEX),
      createdBy: {
        id: EDITOR_GE_ID,
        name: EDITOR_GE.name,
      },
      status: SuggestionStatus.PENDING,
      resolvedBy: null,
      resolvedAt: null,
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        name: 'Extreme race',
      },
      copyright: null,
      resolution: null,
      image: null,
    });
  });
});
