import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listSources {
  sources {
    nodes {
      id
      name
      url
      script
      harvestMode
      cron
      enabled
      createdAt
      updatedAt
    }
    count
  }
}
`;

describe('anonymous', () => {
  it('shall not pass', async () => {
    const result = await runQuery(query, undefined, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result.errors).toBeDefined();
    expect(result.data).toBeNull();
  });
});

describe('user', () => {
  it('shall not pass', async () => {
    const result = await runQuery(query, undefined, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data).toBeNull();
  });
});

describe('admin', () => {
  it('should list sources', async () => {
    const result = await runQuery(query, undefined, adminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.sources).toBeDefined();
    expect(result.data!.sources.count).toBe(6);
    expect(result.data!.sources.nodes[0].id).toBeDefined();
    const snapshot = result.data!.sources.nodes.map(noTimestamps);
    expect(snapshot).toMatchSnapshot();
  });
});

describe('super admin', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(query, { }, superAdminContext('ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.sources.count).toBe(6);
    const names = result.data!.sources.nodes.map((node: any) => node.name);
    expect(names).toEqual(expect.arrayContaining(['Галисия', 'Georgia']));
  });
});
