import {
  anonContext,
  fakeContext,
  fileExistsInBucket,
  resetTestMinio,
} from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import set from 'lodash/fp/set';

import config from '~/config';
import { holdTransaction, rollbackTransaction } from '~/db';
import { COVERS, TEMP } from '~/s3';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { REGION_GALICIA } from '~/seeds/test/04_regions';

import { testAdministrateRegion } from './administrateRegion.test.generated';

const _mutation = gql`
  mutation administrateRegion($settings: RegionAdminSettings!) {
    administrateRegion(settings: $settings) {
      ...RegionAdmin
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
    const result = await testAdministrateRegion(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await testAdministrateRegion(
      variables,
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await testAdministrateRegion(
      variables,
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('result', () => {
  let result: any;

  beforeEach(async () => {
    result = await testAdministrateRegion(variables, fakeContext(ADMIN));
  });

  it('should return result', () => {
    expect(result.errors).toBeUndefined();
    expect(result.data?.administrateRegion).toMatchObject({
      id: REGION_GALICIA,
      hidden: true,
      premium: true,
      sku: 'region.sku',
      mapsSize: 333333,
      coverImage: {
        mobile: 'imgproxy://covers/galicia_mobile_cover2.jpg',
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
  const vars = set(
    'settings.coverImage.mobile',
    `${config.contentPublicURL}/galicia_mobile_cover2.jpg`,
    variables,
  );

  const result = await testAdministrateRegion(vars, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.administrateRegion).toMatchObject({
    coverImage: {
      mobile: 'imgproxy://covers/galicia_mobile_cover2.jpg',
    },
  });
});

it('should correctly handle null cover urls', async () => {
  const vars = set('settings.coverImage.mobile', null, variables);

  const result = await testAdministrateRegion(vars, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.administrateRegion).toMatchObject({
    coverImage: {
      mobile: null,
    },
  });
});
