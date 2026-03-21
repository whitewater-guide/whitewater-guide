import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { GroupInput } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { GROUP_EU } from '../../../seeds/test/03_groups';
import { anonContext, countRows, fakeContext } from '../../../test/index';
import { UUID_REGEX } from '../../../utils/index';
import { testUpsertGroup } from './upsertGroup.test.generated';

let gBefore: number;
let tBefore: number;

beforeAll(async () => {
  [gBefore, tBefore] = await countRows(true, 'groups', 'groups_translations');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation upsertGroup($group: GroupInput!) {
    upsertGroup(group: $group) {
      ...GroupCore
    }
  }
`;

const group: GroupInput = {
  id: null,
  name: 'New group',
  sku: 'group.sku',
};

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testUpsertGroup({ group }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testUpsertGroup({ group }, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testUpsertGroup({ group }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should throw on invalid input', async () => {
    const invalidInput = {
      id: 'a b',
      name: 'x',
      sku: 'sku',
    };
    const result = await testUpsertGroup(
      { group: invalidInput },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  it('should return result', async () => {
    const result = await testUpsertGroup({ group }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.upsertGroup).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      name: 'New group',
      sku: 'group.sku',
    });
  });

  it('should add one more group', async () => {
    await testUpsertGroup({ group }, fakeContext(ADMIN));
    const [gAfter, tAfter] = await countRows(
      false,
      'groups',
      'groups_translations',
    );
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([1, 1]);
  });
});

describe('update', () => {
  const input: GroupInput = {
    id: GROUP_EU,
    name: 'Evrope',
    sku: 'group.sku',
  };

  it('should return result', async () => {
    const result = await testUpsertGroup({ group: input }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.upsertGroup).toMatchObject(input);
  });

  it('should not change total number of groups', async () => {
    await testUpsertGroup({ group: input }, fakeContext(ADMIN));
    const [gAfter, tAfter] = await countRows(
      false,
      'groups',
      'groups_translations',
    );
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([0, 0]);
  });
});

describe('i18n', () => {
  const inputFr: GroupInput = {
    id: GROUP_EU,
    name: "L'Europe",
    sku: 'group.sku',
  };

  it('should add new translation', async () => {
    await testUpsertGroup({ group: inputFr }, fakeContext(ADMIN, 'fr'));
    const [gAfter, tAfter] = await countRows(
      false,
      'groups',
      'groups_translations',
    );
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([0, 1]);
  });

  it('should modify existing translation', async () => {
    await testUpsertGroup({ group: inputFr }, fakeContext(ADMIN, 'ru'));
    const [gAfter, tAfter] = await countRows(
      false,
      'groups',
      'groups_translations',
    );
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([0, 0]);
    const { name } = await db()
      .table('groups_view')
      .select('name')
      .where({ language: 'ru', id: inputFr.id })
      .first();
    expect(name).toBe("L'Europe");
  });
});

it('should sanitize input', async () => {
  const dirty = { ...group, name: "it's a \\ $1 slash with . ?" };
  const result = await testUpsertGroup({ group: dirty }, fakeContext(ADMIN));
  expect(result).toHaveProperty(
    'data.upsertGroup.name',
    "it's a \\ $1 slash with . ?",
  );
});
