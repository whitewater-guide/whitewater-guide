import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

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
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.findUsers', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(query, variables, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.findUsers', null);
  });

  it('admin should fail', async () => {
    const result = await runQuery(query, variables, adminContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.findUsers', null);
  });

});

describe('results', () => {
  it('should find many', async () => {
    const result = await runQuery(query, { search: 'konstantin' }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(2);
    expect(result.data!.findUsers).toMatchObject([
      { name: 'Another usr' },
      { name: 'Konstantin Kuznetsov' },
    ]);
  });

  it('should find one by name', async () => {
    const result = await runQuery(query, { search: 'uZn' }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(1);
    expect(result.data!.findUsers).toMatchObject([
      { name: 'Konstantin Kuznetsov' },
    ]);
  });

  it('should find one by email', async () => {
    const result = await runQuery(query, { search: 'aOs' }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(1);
    expect(result.data!.findUsers).toMatchObject([
      { name: 'Ivan Ivanov' },
    ]);
  });

  it('should return empty array when not found', async () => {
    const result = await runQuery(query, { search: 'foo' }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.findUsers).toHaveLength(0);
  });

});
