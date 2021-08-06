import {
  copyToTemp,
  countRows,
  fakeContext,
  fileExistsInBucket,
  resetTestMinio,
} from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import path from 'path';

import config from '~/config';
import { db, holdTransaction, rollbackTransaction } from '~/db';
import { TEMP } from '~/s3';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { REGION_GALICIA } from '~/seeds/test/04_regions';
import { GAUGE_GAL_1_1 } from '~/seeds/test/06_gauges';

import { testBulkInsert } from './bulkInsert.test.generated';

const _mutation = gql`
  mutation bulkInsert($regionId: ID!, $hidden: Boolean, $archiveURL: String!) {
    bulkInsert(regionId: $regionId, hidden: $hidden, archiveURL: $archiveURL) {
      count
      log
    }
  }
`;

const vars = {
  regionId: REGION_GALICIA,
  hidden: true,
  archiveURL: `${config.contentPublicURL}/good.tar.gz`,
};

let rBefore: number;
let sBefore: number;

beforeAll(async () => {
  [rBefore, sBefore] = await countRows(true, 'rivers', 'sections');
});

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
  await copyToTemp(
    path.resolve(__dirname, '__tests__/good.tar.gz'),
    'good.tar.gz',
  );
  await copyToTemp(
    path.resolve(__dirname, '__tests__/badJson.tar.gz'),
    'badJson.tar.gz',
  );
});
afterEach(rollbackTransaction);

it.each([
  ['anon', undefined, ApolloErrorCodes.UNAUTHENTICATED],
  ['user', TEST_USER, ApolloErrorCodes.FORBIDDEN],
  ['editor', EDITOR_GA_EC, ApolloErrorCodes.FORBIDDEN],
])(`%s should not be permitted to upload archive`, async (_, user, err) => {
  const result = await testBulkInsert(vars, fakeContext(user));
  expect(result).toHaveGraphqlError(err);
});

it('should fail on archive network error', async () => {
  const result = await testBulkInsert(
    {
      regionId: REGION_GALICIA,
      archiveURL: `${config.contentPublicURL}/missing.tar.gz`,
    },
    fakeContext(ADMIN),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.INTERNAL_SERVER_ERROR);
});

it('should skip invalid sections in JSON', async () => {
  const result = await testBulkInsert(
    {
      regionId: REGION_GALICIA,
      archiveURL: `${config.contentPublicURL}/badJson.tar.gz`,
    },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.bulkInsert?.count).toBe(2);
  const [rAfter, sAfter] = await countRows(false, 'rivers', 'sections');
  expect(result.data?.bulkInsert?.log).toContain('Validation error');
  expect([rAfter - rBefore, sAfter - sBefore]).toEqual([2, 2]);
});

it('should insert 3 sections on 2 rivers', async () => {
  const result = await testBulkInsert(vars, fakeContext(ADMIN));
  const [rAfter, sAfter] = await countRows(false, 'rivers', 'sections');
  expect(result.errors).toBeUndefined();
  expect(result.data?.bulkInsert?.count).toBe(3);
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
  await testBulkInsert(
    {
      regionId: REGION_GALICIA,
      archiveURL: `${config.contentPublicURL}/good.tar.gz`,
    },
    fakeContext(ADMIN),
  );
  await expect(fileExistsInBucket(TEMP, 'good.tar.gz')).resolves.toBe(false);
});
