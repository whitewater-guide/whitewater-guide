import { holdTransaction, rollbackTransaction } from '@db';
import { BANNERS, COVERS, fileExistsInBucket, resetTestMinio, TEMP } from '@minio';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { anonContext, fakeContext, runQuery } from '@test';

const mutation = `
  mutation administrateRegion($settings: RegionAdminSettings!){
    administrateRegion(settings: $settings) {
      id
      hidden
      premium
      sku
      coverImage {
        mobile
      }
      banners {
        sectionDescriptionMobile
        sectionRowMobile
        sectionMediaMobile
        regionDescriptionMobile
        regionLoadingMobile
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
    coverImage: {
      mobile: 'galicia_mobile_cover2.jpg',
    },
    banners: {
      sectionDescriptionMobile: 'sectionDescriptionMobile2.jpg',
      sectionRowMobile: 'sectionRowMobile2.jpg',
      sectionMediaMobile: 'sectionMediaMobile2.jpg',
      regionDescriptionMobile: 'regionDescriptionMobile2.jpg',
      regionLoadingMobile: 'regionLoadingMobile2.jpg',
    },
  },
};

describe('resolvers chain', () => {

  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.administrateRegion', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.administrateRegion', null);
  });

  it('editor should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.administrateRegion', null);
  });

});

describe('result', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(mutation, variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
  });

  it('should return result', async () => {
    expect(result.data!.administrateRegion).toMatchObject({
      id: REGION_GALICIA,
      hidden: true,
      premium: true,
      sku: 'region.sku',
      coverImage: {
        mobile: 'galicia_mobile_cover2.jpg',
      },
      banners: {
        sectionDescriptionMobile: 'sectionDescriptionMobile2.jpg',
        sectionRowMobile: 'sectionRowMobile2.jpg',
        sectionMediaMobile: 'sectionMediaMobile2.jpg',
        regionDescriptionMobile: 'regionDescriptionMobile2.jpg',
        regionLoadingMobile: 'regionLoadingMobile2.jpg',
      },
    });
  });

  it('should delete old files', async () => {
    const deleted: boolean[] = await Promise.all([
      fileExistsInBucket(COVERS, 'galicia_mobile_cover.jpg'),
      fileExistsInBucket(BANNERS, 'sectionDescriptionMobile.jpg'),
      fileExistsInBucket(BANNERS, 'sectionRowMobile.jpg'),
      fileExistsInBucket(BANNERS, 'sectionMediaMobile.jpg'),
      fileExistsInBucket(BANNERS, 'regionDescriptionMobile.jpg'),
      fileExistsInBucket(BANNERS, 'regionLoadingMobile.jpg'),
    ]) as any;
    expect(deleted.every((v: boolean) => !v)).toBe(true);
  });

  it('should move new cover', async () => {
    const tempExists: boolean[] = await Promise.all([
      fileExistsInBucket(TEMP, 'galicia_mobile_cover2.jpg'),
      fileExistsInBucket(TEMP, 'sectionDescriptionMobile2.jpg'),
      fileExistsInBucket(TEMP, 'sectionRowMobile2.jpg'),
      fileExistsInBucket(TEMP, 'sectionMediaMobile2.jpg'),
      fileExistsInBucket(TEMP, 'regionDescriptionMobile2.jpg'),
      fileExistsInBucket(TEMP, 'regionLoadingMobile2.jpg'),
    ]) as any;
    const newExists: boolean[] = await Promise.all([
      fileExistsInBucket(COVERS, 'galicia_mobile_cover2.jpg'),
      fileExistsInBucket(BANNERS, 'sectionDescriptionMobile2.jpg'),
      fileExistsInBucket(BANNERS, 'sectionRowMobile2.jpg'),
      fileExistsInBucket(BANNERS, 'sectionMediaMobile2.jpg'),
      fileExistsInBucket(BANNERS, 'regionDescriptionMobile2.jpg'),
      fileExistsInBucket(BANNERS, 'regionLoadingMobile2.jpg'),
    ]) as any;
    expect(tempExists.every((v: boolean) => !v)).toBe(true);
    expect(newExists.every((v: boolean) => v)).toBe(true);
  });

});
