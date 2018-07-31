import { holdTransaction, rollbackTransaction } from '@db';
import { BANNERS, fileExistsInBucket, resetTestMinio } from '@minio';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { GALICIA_REGION_DESCR_BANNER2 } from '@seeds/14_banners';
import { anonContext, countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@ww-commons';

const query = `
  mutation removeBanner($id: ID!){
    removeBanner(id: $id) {
      id
      deleted
    }
  }
`;

const variables = { id: GALICIA_REGION_DESCR_BANNER2 };

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

describe('resolvers chain', () => {

  it('anon should not pass', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  let result: any;
  let bannersBefore: number;
  let bannersRegionsBefore: number;

  beforeAll(async () => {
    [bannersBefore, bannersRegionsBefore] = await countRows(true, 'banners', 'banners_regions');
  });

  beforeEach(async () => {
    result = await runQuery(query, variables, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted banner id and deleted field', () => {
    expect(result.data.removeBanner).toEqual({
      id: GALICIA_REGION_DESCR_BANNER2,
      deleted: true,
    });
  });

  it('should remove from banners table', async () => {
    const [bannersAfter] = await countRows(false, 'banners');
    expect(bannersBefore - bannersAfter).toBe(1);
  });

  it('should remove from banners_regions table', async () => {
    const [brAfter] = await countRows(false, 'banners_regions');
    expect(bannersRegionsBefore - brAfter).toBe(1);
  });

  it('should remove file from bucket', async () => {
    const exists = await fileExistsInBucket(BANNERS, 'banner_4.jpg');
    expect(exists).toBe(false);
  });

});
