import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { TEST_USER, TEST_USER2 } from '../../../seeds/test/01_users';
import {
  DESCENT_01,
  DESCENT_02,
  DESCENT_2_SHARE_TOKEN,
} from '../../../seeds/test/18_descents';
import { fakeContext } from '../../../test/index';
import { testGetDescent } from './descent.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query getDescent($id: ID, $shareToken: String) {
    descent(id: $id, shareToken: $shareToken) {
      ...DescentCore
      ...TimestampedMeta

      section {
        ...SectionNameShort
        region {
          id
          name
        }
        difficulty
      }
    }
  }
`;

describe('permissions', () => {
  type PermissionsTestCase = [string, any, any];

  it.each<PermissionsTestCase>([
    ['anon should get public descent', { id: DESCENT_01 }, undefined],
    ['user should get public descent', { id: DESCENT_01 }, TEST_USER],
    ['user should get own private descent', { id: DESCENT_02 }, TEST_USER],
    [
      'user should get other users private descent with share token',
      { shareToken: DESCENT_2_SHARE_TOKEN },
      TEST_USER2,
    ],
  ])('%s', async (_, vars, user) => {
    const result = await testGetDescent(vars, fakeContext(user));
    expect(result.errors).toBeUndefined();
    expect(result.data?.descent).toBeTruthy();
  });

  it.each<PermissionsTestCase>([
    ['anon should not get private descent', { id: DESCENT_02 }, undefined],
    [
      'user should not get other users private descent',
      { id: DESCENT_02 },
      TEST_USER2,
    ],
    [
      'anon should not get other users private descent with share token',
      { shareToken: DESCENT_2_SHARE_TOKEN },
      undefined,
    ],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', async (_, vars, user) => {
    const result = await testGetDescent(vars, fakeContext(user));
    expect(result.errors).toBeTruthy();
    expect(result.data?.descent).toBeNull();
  });
});

it('should return descent', async () => {
  const result = await testGetDescent({ id: DESCENT_01 });
  expect(result.errors).toBeUndefined();
  expect(result.data?.descent).toMatchSnapshot();
});

it('should return null when no id is provided', async () => {
  const result = await testGetDescent({});
  expect(result.errors).toBeUndefined();
  expect(result.data?.descent).toBeNull();
});
