import { MutationNotAllowedError } from '../../../apollo';
import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation removeRiver($id: ID!){
    removeRiver(id: $id)
  }
`;

const riverWithSections = { id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a' }; // Gal_riv_One
const riverWithoutSections = { id: 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a' }; // Gal_riv_two

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, riverWithoutSections, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeRiver', null);
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, riverWithoutSections, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeRiver', null);
  });
});

describe('effects', () => {

  test('should not remove river which has sections', async () => {
    const result = await runQuery(query, riverWithSections, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Delete all sections first!');
    expect(result).toHaveProperty('data.removeRiver', null);
  });

  test('should return deleted river id', async () => {
    const result = await runQuery(query, riverWithoutSections, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.removeRiver', riverWithoutSections.id);
  });

  test('should remove from rivers table', async () => {
    const result = await runQuery(query, riverWithoutSections, fakeContext(EDITOR_GA_EC));
    const { count } = await db().table('rivers').count().first();
    expect(count).toBe('3');
  });

  test('should remove from rivers translation table', async () => {
    const result = await runQuery(query, riverWithoutSections, fakeContext(EDITOR_GA_EC));
    const count = await db().table('rivers_translations').count().first();
    expect(count.count).toBe('5');
  });

});
