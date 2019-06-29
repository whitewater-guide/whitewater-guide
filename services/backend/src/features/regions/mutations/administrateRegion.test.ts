import { holdTransaction, rollbackTransaction } from '@db';
import { COVERS, fileExistsInBucket, resetTestMinio, TEMP } from '@minio';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import set from 'lodash/fp/set';

const mutation = `
  mutation administrateRegion($settings: RegionAdminSettings!){
    administrateRegion(settings: $settings) {
      id
      hidden
      premium
      sku
      mapsSize
      coverImage {
        mobile
      }
    }
  }
`;

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

const variables = {
  settings: {
    id: REGION_GALICIA,
    hidden: true,
    premium: true,
    sku: 'region.sku',
    mapsSize: 333333,
    coverImage: {
      mobile: 'galicia_mobile_cover2.jpg',
    },
  },
};

describe('resolvers chain', () => {
  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await runQuery(
      mutation,
      variables,
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('result', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(mutation, variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
  });

  it('should return result', async () => {
    const { PROTOCOL, MINIO_DOMAIN } = process.env;
    expect(result.data!.administrateRegion).toMatchObject({
      id: REGION_GALICIA,
      hidden: true,
      premium: true,
      sku: 'region.sku',
      mapsSize: 333333,
      coverImage: {
        mobile: `${PROTOCOL}://${MINIO_DOMAIN}/covers/galicia_mobile_cover2.jpg`,
      },
    });
  });

  it('should delete old files', async () => {
    const deleted: boolean[] = (await Promise.all([
      fileExistsInBucket(COVERS, 'galicia_mobile_cover.jpg'),
    ])) as any;
    expect(deleted.every((v: boolean) => !v)).toBe(true);
  });

  it('should move new cover', async () => {
    const tempExists: boolean[] = (await Promise.all([
      fileExistsInBucket(TEMP, 'galicia_mobile_cover2.jpg'),
    ])) as any;
    const newExists: boolean[] = (await Promise.all([
      fileExistsInBucket(COVERS, 'galicia_mobile_cover2.jpg'),
    ])) as any;
    expect(tempExists.every((v: boolean) => !v)).toBe(true);
    expect(newExists.every((v: boolean) => v)).toBe(true);
  });
});

it('should correctly handle absolute cover urls', async () => {
  const { PROTOCOL, MINIO_DOMAIN } = process.env;
  const vars = set(
    'settings.coverImage.mobile',
    `${PROTOCOL}://${MINIO_DOMAIN}/covers/galicia_mobile_cover2.jpg`,
    variables,
  );

  const result = await runQuery(mutation, vars, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.administrateRegion).toMatchObject({
    coverImage: {
      mobile: `${PROTOCOL}://${MINIO_DOMAIN}/covers/galicia_mobile_cover2.jpg`,
    },
  });
});

it('should correctly handle null cover urls', async () => {
  const vars = set('settings.coverImage.mobile', null, variables);

  const result = await runQuery(mutation, vars, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.administrateRegion).toMatchObject({
    coverImage: {
      mobile: null,
    },
  });
});
