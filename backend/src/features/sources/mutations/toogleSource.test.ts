import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { toggleSourceQuery } from './toggleSource';

const query = `
  mutation toggleSource($id: ID!, $enabled: Boolean!){
    toggleSource(id: $id, enabled: $enabled) {
      id
      language
      enabled
    }
  }
`;

const gal = { id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a', enabled: true };
const nor = { id: '786251d4-aa9d-11e7-abc4-cec278b6b50a', enabled: false };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, gal, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleSource).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, gal, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleSource).toBeNull();
  });
});

describe('effects', () => {
  it('should enable', async () => {
    const result = await runQuery(query, gal, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleSource).toMatchObject({
      ...gal,
      language: 'en',
    });
  });

  it('should disable', async () => {
    const result = await runQuery(query, nor, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleSource).toMatchObject({
      ...nor,
      language: 'en',
    });
  });
});

describe('sql', () => {
  test('should use correct query', () => {
    expect(toggleSourceQuery(gal)).toMatchSnapshot();
  });
});

describe('jobs', async () => {
  it.skip('should stop jobs', () => {
    throw new Error('not implemented yet');
  });

  it.skip('should start jobs', () => {
    throw new Error('not implemented yet');
  });
});
