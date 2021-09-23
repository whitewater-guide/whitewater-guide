import {
  anonContext,
  copyToTemp,
  countRows,
  fakeContext,
  fileExistsInBucket,
  resetTestMinio,
  UUID_REGEX,
} from '@test';
import {
  MediaKind,
  SuggestionInput,
  SuggestionStatus,
} from '@whitewater-guide/schema';
import gql from 'graphql-tag';
import * as path from 'path';

import config from '~/config';
import { db, holdTransaction, rollbackTransaction } from '~/db';
import { MEDIA } from '~/s3';
import {
  BOOM_USER_1500,
  BOOM_USER_1500_ID,
  EDITOR_GE,
  EDITOR_GE_ID,
} from '~/seeds/test/01_users';
import { GEORGIA_BZHUZHA_EXTREME } from '~/seeds/test/09_sections';

import { testAddSuggestion } from './addSuggestion.test.generated';

let sBefore: number;
let mBefore: number;

beforeAll(async () => {
  [sBefore, mBefore] = await countRows(true, 'suggestions', 'media');
});

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
  await copyToTemp(
    path.resolve(__dirname, '__tests__/test.jpg'),
    'suggested_media.jpg',
  );
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

const _mutation = gql`
  mutation addSuggestion($suggestion: SuggestionInput!) {
    addSuggestion(suggestion: $suggestion) {
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
  filename: `${config.contentPublicURL}/suggested_media.jpg`,
  resolution: [100, 100],
};

const withoutMedia: SuggestionInput = {
  section: { id: GEORGIA_BZHUZHA_EXTREME },
  description: 'foobar',
  copyright: null,
  filename: null,
  resolution: null,
};

it('anon should not fail with media', async () => {
  const result = await testAddSuggestion(
    { suggestion: withMedia },
    anonContext(),
  );
  expect(result.errors).toBeUndefined();
});

it('should fail for invalid input', async () => {
  const result = await testAddSuggestion(
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
    const result = await testAddSuggestion(
      { suggestion: withMedia },
      fakeContext(BOOM_USER_1500),
    );
    expect(result.errors).toBeUndefined();
  });

  it('should not fail without media', async () => {
    const result = await testAddSuggestion(
      { suggestion: withoutMedia },
      fakeContext(BOOM_USER_1500),
    );
    expect(result.errors).toBeUndefined();
  });

  it('should add one more suggestion', async () => {
    await testAddSuggestion(
      { suggestion: withMedia },
      fakeContext(BOOM_USER_1500),
    );
    const [sAfter] = await countRows(false, 'suggestions');
    expect(sAfter - sBefore).toBe(1);
  });

  it('should return result', async () => {
    const result = await testAddSuggestion(
      { suggestion: withMedia },
      fakeContext(BOOM_USER_1500),
    );
    const inserted = result?.data?.addSuggestion;
    expect(inserted).toEqual({
      __typename: 'Suggestion',
      id: expect.stringMatching(UUID_REGEX),
      description: 'foobar',
      createdAt: expect.any(Date),
      createdBy: {
        id: BOOM_USER_1500_ID,
        name: BOOM_USER_1500.name,
      },
      status: SuggestionStatus.Pending,
      resolvedBy: null,
      resolvedAt: null,
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        name: 'Extreme race',
      },
      copyright: 'copyleft',
      resolution: [100, 100],
      image: 'imgproxy://media/suggested_media.jpg',
    });
  });

  it('should move temp file to media bucket', async () => {
    await testAddSuggestion(
      { suggestion: withMedia },
      fakeContext(BOOM_USER_1500),
    );
    await expect(
      fileExistsInBucket(
        MEDIA,
        'suggested_media.jpg',
        'a1c4720fa8526d4a8560dd1cb29c0ea7',
      ),
    ).resolves.toBe(true);
  });

  it('should not create media', async () => {
    await testAddSuggestion(
      { suggestion: withMedia },
      fakeContext(BOOM_USER_1500),
    );
    const [mAfter] = await countRows(false, 'media');
    expect(mAfter).toBe(mBefore);
  });
});

describe('editor', () => {
  it("should auto-approve editor's media suggestions", async () => {
    const { data, errors } = await testAddSuggestion(
      { suggestion: withMedia },
      fakeContext(EDITOR_GE),
    );
    expect(errors).toBeUndefined();
    const inserted = data?.addSuggestion;
    expect(inserted).toEqual({
      __typename: 'Suggestion',
      id: expect.stringMatching(UUID_REGEX),
      description: 'foobar',
      createdAt: expect.any(Date),
      createdBy: {
        id: EDITOR_GE_ID,
        name: EDITOR_GE.name,
      },
      status: SuggestionStatus.Accepted,
      resolvedBy: {
        id: EDITOR_GE_ID,
        name: EDITOR_GE.name,
      },
      resolvedAt: expect.any(Date),
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        name: 'Extreme race',
      },
      copyright: 'copyleft',
      resolution: [100, 100],
      image: 'imgproxy://media/suggested_media.jpg',
    });
  });

  it("should convert editor's suggestion to media", async () => {
    await testAddSuggestion({ suggestion: withMedia }, fakeContext(EDITOR_GE));
    const media = await db()
      .select('*')
      .from('media_view')
      .where({ language: 'en' })
      .orderBy('created_at', 'desc')
      .first();
    expect(media).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      kind: MediaKind.Photo,
      description: 'foobar',
      url: 'suggested_media.jpg',
      created_by: EDITOR_GE_ID,
    });
  });

  it('should move temp file to media bucket', async () => {
    await testAddSuggestion({ suggestion: withMedia }, fakeContext(EDITOR_GE));
    await expect(
      fileExistsInBucket(
        MEDIA,
        'suggested_media.jpg',
        'a1c4720fa8526d4a8560dd1cb29c0ea7',
      ),
    ).resolves.toBe(true);
  });

  it("should NOT auto-approve editor's text suggestions", async () => {
    const { data, errors } = await testAddSuggestion(
      { suggestion: withoutMedia },
      fakeContext(EDITOR_GE),
    );
    expect(errors).toBeUndefined();
    const inserted = data?.addSuggestion;
    expect(inserted).toEqual({
      __typename: 'Suggestion',
      id: expect.stringMatching(UUID_REGEX),
      description: 'foobar',
      createdAt: expect.any(Date),
      createdBy: {
        id: EDITOR_GE_ID,
        name: EDITOR_GE.name,
      },
      status: SuggestionStatus.Pending,
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
