import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_NO_EC,
  EDITOR_NO_EC_ID,
  TEST_USER_ID,
} from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/index';
import { testFindUsers } from './findUsers.test.generated';

const _query = gql`
  query findUsers($filter: UserFilterOptions!) {
    findUsers(filter: $filter) {
      ...UserCore
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { filter: { searchString: 'user' } };

  it('anon should fail', async () => {
    const result = await testFindUsers(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await testFindUsers(variables, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('admin should fail', async () => {
    const result = await testFindUsers(variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('results', () => {
  it('should find many', async () => {
    const result = await testFindUsers(
      { filter: { searchString: 'konstantin' } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.findUsers).toMatchObject([
      { name: 'Another usr' },
      { name: 'Konstantin Kuznetsov' },
    ]);
  });

  it('should find one by name', async () => {
    const result = await testFindUsers(
      { filter: { searchString: 'uZn' } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.findUsers).toMatchObject([
      { name: 'Konstantin Kuznetsov' },
    ]);
  });

  it('should find one by email', async () => {
    const result = await testFindUsers(
      { filter: { searchString: 'aOs' } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.findUsers).toMatchObject([{ name: 'Ivan Ivanov' }]);
  });

  it('should return empty array when not found', async () => {
    const result = await testFindUsers(
      { filter: { searchString: 'foo' } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.findUsers).toHaveLength(0);
  });

  it('should find editors', async () => {
    const result = await testFindUsers(
      { filter: { searchString: 'gmAil', editorsOnly: true } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.findUsers).toContainEqual(
      expect.objectContaining({
        id: EDITOR_NO_EC_ID,
      }),
    );
    expect(result.data?.findUsers).not.toContainEqual(
      expect.objectContaining({
        id: TEST_USER_ID,
      }),
    );
  });

  it('should find admins when looking for editors', async () => {
    const result = await testFindUsers(
      { filter: { searchString: '', editorsOnly: true } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.findUsers).toContainEqual(
      expect.objectContaining({
        id: ADMIN_ID,
      }),
    );
  });
});
