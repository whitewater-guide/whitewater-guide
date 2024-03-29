import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { BannerInput } from '@whitewater-guide/schema';
import { BannerKind, BannerPlacement } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import config from '../../../config';
import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { BANNERS, TEMP } from '../../../s3/index';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { GROUP_LATIN } from '../../../seeds/test/03_groups';
import { REGION_GALICIA, REGION_NORWAY } from '../../../seeds/test/04_regions';
import {
  GALICIA_REGION_DESCR_BANNER,
  GALICIA_REGION_DESCR_BANNER2,
} from '../../../seeds/test/14_banners';
import {
  anonContext,
  copyToTemp,
  countRows,
  fakeContext,
  fileExistsInBucket,
  resetTestMinio,
} from '../../../test/index';
import { resolveRelative, UUID_REGEX } from '../../../utils/index';
import { testUpsertBanner } from './upsertBanner.test.generated';

let bBefore: number;
let brBefore: number;
let bgBefore: number;

beforeAll(async () => {
  [bBefore, brBefore, bgBefore] = await countRows(
    true,
    'banners',
    'banners_regions',
    'banners_groups',
  );
});

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

const _mutation = gql`
  mutation upsertBanner($banner: BannerInput!) {
    upsertBanner(banner: $banner) {
      ...BannerCore
      source {
        kind
        url
      }
      ...BannerRegions
      ...BannerGroups
    }
  }
`;

const banner: BannerInput = {
  id: null,
  name: 'New banner',
  slug: 'new_banner',
  enabled: true,
  priority: 1,
  placement: BannerPlacement.MobileSectionRow,
  source: {
    kind: BannerKind.WebView,
    url: 'https://ya.ru/new_banner',
  },
  link: 'https://go.to/new_banner',
  extras: { foo: 'bar' },
  regions: [{ id: REGION_NORWAY }],
  groups: [{ id: GROUP_LATIN }],
};

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testUpsertBanner({ banner }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testUpsertBanner({ banner }, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testUpsertBanner(
      { banner },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should throw on invalid input', async () => {
    const invalidInput: BannerInput = {
      id: null,
      name: '',
      slug: 'x',
      enabled: true,
      priority: 1,
      placement: BannerPlacement.MobileSectionRow,
      source: {
        kind: BannerKind.WebView,
        url: '',
      },
      link: '',
      extras: 'x' as any,
      regions: [{ id: 'bax' }],
      groups: [{ id: 'nun' }],
    };
    const result = await testUpsertBanner(
      { banner: invalidInput },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  it('should return result', async () => {
    const result = await testUpsertBanner({ banner }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.upsertBanner).toEqual({
      ...banner,
      id: expect.stringMatching(UUID_REGEX),
      regions: {
        nodes: [
          {
            id: REGION_NORWAY,
            name: 'Norway',
          },
        ],
        count: 1,
      },
      groups: {
        nodes: [
          {
            id: GROUP_LATIN,
            name: 'Latin America',
          },
        ],
        count: 1,
      },
    });
  });

  it('should add one more banner', async () => {
    await testUpsertBanner({ banner }, fakeContext(ADMIN));
    const [bAfter, brAfter, bgAfter] = await countRows(
      false,
      'banners',
      'banners_regions',
      'banners_groups',
    );
    expect([bAfter - bBefore, brAfter - brBefore, bgAfter - bgBefore]).toEqual([
      1, 1, 1,
    ]);
  });
});

describe('update', () => {
  const input: BannerInput = {
    ...banner,
    id: GALICIA_REGION_DESCR_BANNER,
    regions: [{ id: REGION_GALICIA }],
    groups: [],
  };

  it('should return result', async () => {
    const result = await testUpsertBanner(
      { banner: input },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.upsertBanner).toEqual({
      ...banner,
      id: GALICIA_REGION_DESCR_BANNER,
      slug: 'galicia_region_descr_banner',
      regions: {
        nodes: [
          {
            id: REGION_GALICIA,
            name: 'Galicia',
          },
        ],
        count: 1,
      },
      groups: {
        nodes: [],
        count: 0,
      },
    });
  });

  it('should not change total number of banners', async () => {
    await testUpsertBanner({ banner: input }, fakeContext(ADMIN));
    const [bAfter, brAfter, bgAfter] = await countRows(
      false,
      'banners',
      'banners_regions',
      'banners_groups',
    );
    expect([bAfter - bBefore, brAfter - brBefore, bgAfter - bgBefore]).toEqual([
      0, 0, 0,
    ]);
  });

  it('should not change slug', async () => {
    const result = await testUpsertBanner(
      { banner: input },
      fakeContext(ADMIN),
    );
    expect(result.data?.upsertBanner?.slug).not.toEqual(banner.slug);
  });
});

describe('files', () => {
  const NEW_FILE_ID = '8e515860-c94f-11e8-a8d5-f2801f1b9fd1';

  const newImageBanner: BannerInput = {
    ...banner,
    source: {
      kind: BannerKind.Image,
      url: NEW_FILE_ID,
    },
  };

  const oldBanner: BannerInput = {
    ...banner,
    name: 'foo',
    id: GALICIA_REGION_DESCR_BANNER2,
    source: {
      kind: BannerKind.Image,
      url: 'banner_4.jpg',
    },
  };

  const oldImageBanner: BannerInput = {
    ...banner,
    id: GALICIA_REGION_DESCR_BANNER2,
    source: {
      kind: BannerKind.Image,
      url: NEW_FILE_ID,
    },
  };

  const oldUrlBanner: BannerInput = {
    ...banner,
    id: GALICIA_REGION_DESCR_BANNER2,
    source: {
      kind: BannerKind.WebView,
      url: 'http://ya.ru',
    },
  };

  beforeEach(async () => {
    // Emulate file with the same key as existing avatar uploaded by user
    await copyToTemp(
      resolveRelative(__dirname, '__tests__/banner_5.jpg'),
      NEW_FILE_ID,
    );
  });

  it('test banner should exist in bucket', async () => {
    await expect(
      fileExistsInBucket(
        BANNERS,
        'banner_4.jpg',
        '6a188ddefa676b8d60082f21be94d212',
      ),
    ).resolves.toBe(true);
  });

  it('should move file from temp to banners', async () => {
    const result = await testUpsertBanner(
      { banner: newImageBanner },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    await expect(fileExistsInBucket(TEMP, 'banner_5.jpg')).resolves.toBe(false);
    await expect(fileExistsInBucket(TEMP, NEW_FILE_ID)).resolves.toBe(false);
    await expect(
      fileExistsInBucket(
        BANNERS,
        NEW_FILE_ID,
        'cdd9bc2685a21655675f546c3d828d5f',
      ),
    ).resolves.toBe(true);
  });

  it('should accept full filenames', async () => {
    const result = await testUpsertBanner(
      {
        banner: {
          ...oldBanner,
          source: {
            ...oldBanner.source,
            url: `${config.contentPublicURL}/${oldBanner.source.url}`,
          },
        },
      },
      fakeContext(ADMIN),
    );
    const upsertedBanner = result.data?.upsertBanner;
    const { source } = await db()
      .table('banners')
      .select(['source'])
      .where({ id: upsertedBanner?.id })
      .first();
    expect(source).toEqual(oldBanner.source);
    expect(upsertedBanner?.source.url).toEqual(
      `imgproxy://banners/${oldBanner.source.url}`,
    );
  });

  it('should store only filenames', async () => {
    const result = await testUpsertBanner(
      { banner: newImageBanner },
      fakeContext(ADMIN),
    );
    const upsertedBanner = result.data?.upsertBanner;
    const { source } = await db()
      .table('banners')
      .select(['source'])
      .where({ id: upsertedBanner?.id })
      .first();
    expect(source).toEqual(newImageBanner.source);
    expect(upsertedBanner?.source.url).toEqual(
      `imgproxy://banners/${newImageBanner.source.url}`,
    );
  });

  it('should delete old image when new is uploaded', async () => {
    const result = await testUpsertBanner(
      { banner: oldImageBanner },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    await expect(fileExistsInBucket(TEMP, 'banner_5.jpg')).resolves.toBe(false);
    await expect(
      fileExistsInBucket(
        BANNERS,
        NEW_FILE_ID,
        'cdd9bc2685a21655675f546c3d828d5f',
      ),
    ).resolves.toBe(true);
    await expect(fileExistsInBucket(BANNERS, 'banner_4.jpg')).resolves.toBe(
      false,
    );
  });

  it('should not delete old image when it is not changed', async () => {
    const result = await testUpsertBanner(
      { banner: oldBanner },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    await expect(fileExistsInBucket(TEMP, 'banner_5.jpg')).resolves.toBe(false);
    await expect(
      fileExistsInBucket(
        BANNERS,
        'banner_4.jpg',
        '6a188ddefa676b8d60082f21be94d212',
      ),
    ).resolves.toBe(true);
  });

  it('should delete image when isImage changes to false', async () => {
    const result = await testUpsertBanner(
      { banner: oldUrlBanner },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    await expect(fileExistsInBucket(TEMP, 'banner_5.jpg')).resolves.toBe(false);
    await expect(fileExistsInBucket(BANNERS, 'banner_4.jpg')).resolves.toBe(
      false,
    );
  });
});

it('should sanitize input', async () => {
  const dirty = { ...banner, name: "it's a \\ $1 slash with . ?" };
  const result = await testUpsertBanner({ banner: dirty }, fakeContext(ADMIN));
  expect(result).toHaveProperty(
    'data.upsertBanner.name',
    "it's a \\ $1 slash with . ?",
  );
});
