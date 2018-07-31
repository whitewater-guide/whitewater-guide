import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC } from '@seeds/01_users';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@ww-commons';

const query = `
  query findUsers($search: String!){
    findUsers(search: $search) {
      id
      name
      email
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { search: 'user' };

  it('anon should fail', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('admin should fail', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

});

describe('results', () => {
  it('should find many', async () => {
    const result = await runQuery(query, { search: 'konstantin' }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(2);
    expect(result.data!.findUsers).toMatchObject([
      { name: 'Another usr' },
      { name: 'Konstantin Kuznetsov' },
    ]);
  });

  it('should find one by name', async () => {
    const result = await runQuery(query, { search: 'uZn' }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(1);
    expect(result.data!.findUsers).toMatchObject([
      { name: 'Konstantin Kuznetsov' },
    ]);
  });

  it('should find one by email', async () => {
    const result = await runQuery(query, { search: 'aOs' }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(1);
    expect(result.data!.findUsers).toMatchObject([
      { name: 'Ivan Ivanov' },
    ]);
  });

  it('should return empty array when not found', async () => {
    const result = await runQuery(query, { search: 'foo' }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(0);
  });

});
