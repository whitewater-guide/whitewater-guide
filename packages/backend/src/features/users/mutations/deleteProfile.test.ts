import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { synapseClient } from '../../../features/chats/index';
import {
  ADMIN,
  BOOM_USER_1500,
  BOOM_USER_3500,
  EDITOR_GA_EC,
  EDITOR_GE,
  EDITOR_NO,
  EDITOR_NO_EC,
  TEST_USER,
  TEST_USER_ID,
  TEST_USER2,
} from '../../../seeds/test/01_users';
import { anonContext, countRows, fakeContext } from '../../../test/index';
import { testDeleteProfile } from './deleteProfile.test.generated';

jest.mock('../../chats/SynapseClient');

const _mutation = gql`
  mutation deleteProfile {
    deleteProfile
  }
`;

let cntBefore: number[];
const entities = [
  'sections_points',
  'points',
  'rivers',
  'regions',
  'gauges',
  'sections',
  'sections_tags',
  'media',
];

beforeAll(async () => {
  cntBefore = await countRows(true, ...entities);
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

it('should fail for anons', async () => {
  const result = await testDeleteProfile(undefined, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should fail for admins', async () => {
  const result = await testDeleteProfile(undefined, fakeContext(ADMIN));
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('should delete descents', async () => {
  const result = await testDeleteProfile(undefined, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  const [{ count }] = await db()
    .table('descents')
    .count()
    .where('user_id', TEST_USER_ID);
  expect(count).toBe('0');
});

it('should not delete other entities', async () => {
  for (const u of [
    BOOM_USER_1500,
    BOOM_USER_3500,
    EDITOR_GA_EC,
    EDITOR_GE,
    EDITOR_NO,
    EDITOR_NO_EC,
    TEST_USER,
    TEST_USER2,
  ]) {
    await testDeleteProfile(undefined, fakeContext(u));
  }
  const cntAfter = await countRows(false, ...entities);
  expect(cntBefore).toEqual(cntAfter);
});

it('should delete synapse user', async () => {
  const result = await testDeleteProfile(undefined, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(synapseClient.deactivateAccount).toHaveBeenCalledWith(TEST_USER_ID);
});
