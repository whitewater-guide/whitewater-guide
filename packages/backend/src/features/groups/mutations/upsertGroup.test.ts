import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { GROUP_EU } from '../../../seeds/test/03_groups';
import { anonContext, fakeContext } from '../../../test/context';
import { countRows } from '../../../test/countRows';
import { runQuery } from '../../../test/db-helpers';
import { UUID_REGEX } from '../../../test/isUUID';
import { GroupInput } from '../../../ww-commons';

let gBefore: number;
let tBefore: number;

beforeAll(async () => {
  [gBefore, tBefore] = await countRows(true, 'groups', 'groups_translations');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  mutation upsertGroup($group: GroupInput!){
    upsertGroup(group: $group){
      id
      name
    }
  }
`;

const group: GroupInput = {
  id: null,
  name: 'New group',
};

describe('resolvers chain', () => {

  it('anon should not pass', async () => {
    const result = await runQuery(query, { group }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertGroup', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, { group }, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertGroup', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, { group }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertGroup', null);
  });

  it('should throw on invalid input', async () => {
    const invalidInput = {
      id: 'a b',
      name: 'x',
    };
    const result = await runQuery(query, { group: invalidInput }, fakeContext(ADMIN));
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result.data!.upsertGroup).toBeNull();
    expect((result.errors![0] as any).data).toMatchSnapshot();
  });
});

describe('insert', () => {
  it('should return result', async () => {
    const result = await runQuery(query, { group }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.upsertGroup).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      name: 'New group',
    });
  });

  it('should add one more group', async () => {
    await runQuery(query, { group }, fakeContext(ADMIN));
    const [gAfter, tAfter] = await countRows(false, 'groups', 'groups_translations');
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([1, 1]);
  });

});

describe('update', () => {
  const input: GroupInput = {
    id: GROUP_EU,
    name: 'Evrope',
  };

  it('should return result', async () => {
    const result = await runQuery(query, { group: input }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.upsertGroup).toMatchObject(input);
  });

  it('should not change total number of groups', async () => {
    await runQuery(query, { group: input }, fakeContext(ADMIN));
    const [gAfter, tAfter] = await countRows(false, 'groups', 'groups_translations');
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([0, 0]);
  });

});

describe('i18n', () => {
  const inputFr: GroupInput = {
    id: GROUP_EU,
    name: "L'Europe",
  };

  it('should add new translation', async () => {
    await runQuery(query, { group: inputFr }, fakeContext(ADMIN, 'fr'));
    const [gAfter, tAfter] = await countRows(false, 'groups', 'groups_translations');
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([0, 1]);
  });

  it('should modify existing translation', async () => {
    await runQuery(query, { group: inputFr }, fakeContext(ADMIN, 'ru'));
    const [gAfter, tAfter] = await countRows(false, 'groups', 'groups_translations');
    expect([gAfter - gBefore, tAfter - tBefore]).toEqual([0, 0]);
    const { name } = await db().table('groups_view').select('name')
      .where({ language: 'ru', id: inputFr.id }).first();
    expect(name).toBe("L'Europe");
  });
});

it('should sanitize input', async () => {
  const dirty = { ...group, name: "it's a \\ slash" };
  const result = await runQuery(query, { group: dirty }, fakeContext(ADMIN));
  expect(result).toHaveProperty('data.upsertGroup.name', "it's a \\ slash");
});
