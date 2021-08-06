import { anonContext, countRows, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { GROUP_ALL, GROUP_EU } from '~/seeds/test/03_groups';

import { testRemoveGroup } from './removeGroup.test.generated';

const _mutation = gql`
  mutation removeGroup($id: String!) {
    removeGroup(id: $id)
  }
`;

const variables = { id: GROUP_EU };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testRemoveGroup(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testRemoveGroup(variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testRemoveGroup(variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  let result: any;
  let groupsBefore: number;
  let translationsBefore: number;

  beforeAll(async () => {
    [groupsBefore, translationsBefore] = await countRows(
      true,
      'groups',
      'groups_translations',
    );
  });

  beforeEach(async () => {
    result = await testRemoveGroup(variables, fakeContext(ADMIN));
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
  const result = await testRemoveGroup({ id: GROUP_ALL }, fakeContext(ADMIN));
  expect(result).toHaveGraphqlError(
    ApolloErrorCodes.MUTATION_NOT_ALLOWED,
    'Cannot toggle gauge for all-at-once sources',
  );
});
