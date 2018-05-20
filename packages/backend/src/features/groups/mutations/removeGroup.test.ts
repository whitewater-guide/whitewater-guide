import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { GROUP_ALL, GROUP_EU } from '../../../seeds/test/03_groups';
import { anonContext, fakeContext } from '../../../test/context';
import { countRows } from '../../../test/countRows';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation removeGroup($id: String!){
    removeGroup(id: $id)
  }
`;

const variables = { id: GROUP_EU };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {

  it('anon should not pass', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeGroup', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeGroup', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeGroup', null);
  });
});

describe('effects', () => {
  let result: any;
  let groupsBefore: number;
  let translationsBefore: number;

  beforeAll(async () => {
    [groupsBefore, translationsBefore] = await countRows(true, 'groups', 'groups_translations');
  });

  beforeEach(async () => {
    result = await runQuery(query, variables, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted group id', () => {
    expect(result.data.removeGroup).toBe(variables.id);
  });

  it('should remove from groups table', async () => {
    const [groupsAfter] = await countRows(false, 'groups');
    expect(groupsBefore - groupsAfter).toBe(1);
  });

  it('should remove from translations table', async () => {
    const [translationsAfter] = await countRows(false, 'groups_translations');
    expect(translationsBefore - translationsAfter).toBe(2);
  });

});

it('should not remove group with all regions', async () => {
  const result = await runQuery(query, { id: GROUP_ALL }, fakeContext(ADMIN));
  expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
  expect(result).toHaveProperty('data.removeGroup', null);
});
