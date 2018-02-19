import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { toggleAllGaugesQuery } from './toggleAllGauges';

const mutation = `
  mutation toggleAllGauges($sourceId: ID!, $enabled: Boolean!){
    toggleAllGauges(sourceId: $sourceId, enabled: $enabled) {
      id
      language
      enabled
    }
  }
`;

const gal = { sourceId: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a', enabled: true };
const nor = { sourceId: '786251d4-aa9d-11e7-abc4-cec278b6b50a', enabled: false };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(mutation, gal, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleAllGauges).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(mutation, gal, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleAllGauges).toBeNull();
  });
});

describe('effects', () => {
  it('should enable and return only toggled', async () => {
    const result = await runQuery(mutation, gal, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleAllGauges).toMatchObject([
      { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', language: 'en', enabled: true },
    ]);
  });

  it('should disable and return only toggled', async () => {
    const result = await runQuery(mutation, nor, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleAllGauges).toMatchObject([
      { id: 'c03184b4-aaa0-11e7-abc4-cec278b6b50a', language: 'en', enabled: false },
    ]);
  });
});

describe('jobs', async () => {
  it('should stop jobs', () => {
    throw new Error('not implemented yet');
  });

  it('should start jobs', () => {
    throw new Error('not implemented yet');
  });
});

describe('sql', () => {
  test('should use correct query', () => {
    expect(toggleAllGaugesQuery(gal)).toMatchSnapshot();
  });
});
