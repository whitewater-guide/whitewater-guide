import { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { HarvestMode } from '../../../ww-commons/features/sources';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listScripts {
    scripts {
      id
      name
      harvestMode
      error
    }
  }
`;

describe('resolvers chain', () => {

  describe('anonymous', () => {
    test('shall not pass', async () => {
      const result = await runQuery(query, undefined, anonContext());
      expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
      expect(result.data).toBeNull();
    });
  });

  describe('user', () => {
    test('shall not pass', async () => {
      const result = await runQuery(query, undefined, fakeContext(EDITOR_NO_EC));
      expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
      expect(result.data).toBeNull();
    });
  });

});

it('should return some scripts', async () => {
  const result = await runQuery(query, undefined, fakeContext(EDITOR_GA_EC));
  expect(result.data!.scripts).toEqual(expect.arrayContaining([{
    id: expect.any(String),
    name: expect.any(String),
    harvestMode: HarvestMode.ALL_AT_ONCE,
    error: null,
  }]));
});
