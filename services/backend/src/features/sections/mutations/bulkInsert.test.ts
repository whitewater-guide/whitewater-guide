import db, { holdTransaction, rollbackTransaction } from '@db';
import {
  fileExistsInBucket,
  initMinio,
  resetTestMinio,
  TEMP,
  TEMP_BUCKET_DIR,
} from '@minio';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { GAUGE_GAL_1_1 } from '@seeds/06_gauges';
import { countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { copy } from 'fs-extra';
import path from 'path';

const mutation = `
  mutation bulkInsert($regionId: ID!, $hidden: Boolean, $archiveURL: String!) {
    bulkInsert(regionId: $regionId, hidden: $hidden, archiveURL: $archiveURL) {
      count
      log
    }
  }
`;
const { PROTOCOL, MINIO_DOMAIN } = process.env;

const vars = {
  regionId: REGION_GALICIA,
  hidden: true,
  archiveURL: `${PROTOCOL}://${MINIO_DOMAIN}/${TEMP}/good.tar.gz`,
};

let rBefore: number;
let sBefore: number;

beforeAll(async () => {
  [rBefore, sBefore] = await countRows(true, 'rivers', 'sections');
  await initMinio();
});

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
  await copy(
    path.resolve(__dirname, '__tests__/good.tar.gz'),
    path.resolve(TEMP_BUCKET_DIR, 'good.tar.gz'),
  );
  await copy(
    path.resolve(__dirname, '__tests__/badJson.tar.gz'),
    path.resolve(TEMP_BUCKET_DIR, 'badJson.tar.gz'),
  );
});
afterEach(rollbackTransaction);

it.each([
  ['anon', undefined, ApolloErrorCodes.UNAUTHENTICATED],
  ['user', TEST_USER, ApolloErrorCodes.FORBIDDEN],
  ['editor', EDITOR_GA_EC, ApolloErrorCodes.FORBIDDEN],
])(`%s should not be permitted to upload archive`, async (_, user, err) => {
  const result = await runQuery(mutation, vars, fakeContext(user));
  expect(result).toHaveGraphqlError(err);
});

it('should fail on archive network error', async () => {
  const result = await runQuery(
    mutation,
    {
      regionId: REGION_GALICIA,
      archiveURL: `${PROTOCOL}://${MINIO_DOMAIN}/${TEMP}/missing.tar.gz`,
    },
    fakeContext(ADMIN),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.INTERNAL_SERVER_ERROR);
});

it('should skip invalid sections in JSON', async () => {
  const result = await runQuery(
    mutation,
    {
      regionId: REGION_GALICIA,
      archiveURL: `${PROTOCOL}://${MINIO_DOMAIN}/${TEMP}/badJson.tar.gz`,
    },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.bulkInsert.count).toBe(2);
  const [rAfter, sAfter] = await countRows(false, 'rivers', 'sections');
  expect(result.data.bulkInsert.log).toContain('Validation error');
  expect([rAfter - rBefore, sAfter - sBefore]).toEqual([2, 2]);
});

it('should insert 3 sections on 2 rivers', async () => {
  const result = await runQuery(mutation, vars, fakeContext(ADMIN));
  const [rAfter, sAfter] = await countRows(false, 'rivers', 'sections');
  expect(result.errors).toBeUndefined();
  expect(result.data.bulkInsert.count).toBe(3);
  expect([rAfter - rBefore, sAfter - sBefore]).toEqual([2, 3]);
  const { import_id, hidden, gauge_id } = await db(false)
    .select('import_id', 'hidden', 'gauge_id')
    .from('sections')
    .orderBy('created_at', 'desc')
    .first();
  expect(gauge_id).toBe(GAUGE_GAL_1_1);
  expect(import_id).toBe('whatever01');
  expect(hidden).toBe(true);
});

it('should delete archive after import', async () => {
  await runQuery(
    mutation,
    {
      regionId: REGION_GALICIA,
      archiveURL: `${PROTOCOL}://${MINIO_DOMAIN}/${TEMP}/good.tar.gz`,
    },
    fakeContext(ADMIN),
  );
  await expect(fileExistsInBucket(TEMP, 'good.tar.gz')).resolves.toBe(false);
});
