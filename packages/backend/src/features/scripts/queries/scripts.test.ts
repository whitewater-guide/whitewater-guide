import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { anonContext, fakeContext, runQuery } from '@test';
import { HarvestMode } from '@ww-commons';

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

  it('anon shall not pass', async () => {
    const result = await runQuery(query, undefined, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result.data).toBeNull();
  });

  it('user shall not pass', async () => {
    const result = await runQuery(query, undefined, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data).toBeNull();
  });

  it('editor shall not pass', async () => {
    const result = await runQuery(query, undefined, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data).toBeNull();
  });

});

it('should return some scripts', async () => {
  const result = await runQuery(query, undefined, fakeContext(ADMIN));
  expect(result.data!.scripts).toEqual(expect.arrayContaining([{
    id: expect.any(String),
    name: expect.any(String),
    harvestMode: HarvestMode.ALL_AT_ONCE,
    error: null,
  }]));
});
