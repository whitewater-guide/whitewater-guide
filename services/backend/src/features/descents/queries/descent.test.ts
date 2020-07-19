import { holdTransaction, rollbackTransaction } from '~/db';
import {
  DESCENT_01,
  DESCENT_02,
  DESCENT_2_SHARE_TOKEN,
} from '~/seeds/test/18_descents';
import { runQuery, fakeContext } from '~/test';
import { TEST_USER, TEST_USER2 } from '~/seeds/test/01_users';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query getDescent($id: ID, $shareToken: String) {
    descent(id: $id, shareToken: $shareToken) {
      id
      # userId

      startedAt
      duration
      level {
        value
        unit
      }
      comment
      public

      createdAt
      updatedAt

      section {
        id

        region {
          id
          name
        }
        river {
          id
          name
        }
        name
        difficulty
      }
    }
  }
`;

describe('permissions', () => {
  type PermissionsTestCase = [string, any, any, boolean];

  it.each<PermissionsTestCase>([
    ['anon should get public descent', { id: DESCENT_01 }, undefined, true],
    [
      'anon should not get private descent',
      { id: DESCENT_02 },
      undefined,
      false,
    ],
    ['user should get public descent', { id: DESCENT_01 }, TEST_USER, true],
    [
      'user should get own private descent',
      { id: DESCENT_02 },
      TEST_USER,
      true,
    ],
    [
      'user should not get other users private descent',
      { id: DESCENT_02 },
      TEST_USER2,
      false,
    ],
    [
      'user should get other users private descent with share token',
      { shareToken: DESCENT_2_SHARE_TOKEN },
      TEST_USER2,
      true,
    ],
    [
      'anon should not get other users private descent with share token',
      { shareToken: DESCENT_2_SHARE_TOKEN },
      undefined,
      false,
    ],
  ])('%s', async (_, vars, user, allowed) => {
    const result = await runQuery(query, vars, fakeContext(user));
    if (allowed) {
      expect(result.errors).toBeUndefined();
      expect(result.data?.descent).toBeTruthy();
    } else {
      expect(result.errors).toBeTruthy();
      expect(result.data?.descent).toBeNull();
    }
  });
});

it('should return descent', async () => {
  const result = await runQuery(query, { id: DESCENT_01 });
  expect(result.errors).toBeUndefined();
  expect(result.data?.descent).toMatchSnapshot();
});

it('should return null when no id is provided', async () => {
  const result = await runQuery(query, {});
  expect(result.errors).toBeUndefined();
  expect(result.data?.descent).toBeNull();
});
