import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import { TOTAL_SOURCES } from '~/seeds/test/05_sources';
import { anonContext, fakeContext, noTimestamps, runQuery } from '~/test';

jest.mock('../../gorge/connector');

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
      requestParams
      cron
      enabled
      createdAt
      updatedAt
    }
    count
  }
}
`;

describe('permissions', () => {
  it('anon shall not see internal fields', async () => {
    const result = await runQuery(query, undefined, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.sources.nodes).toHaveLength(TOTAL_SOURCES);
    expect(result.data!.sources.nodes[0]).toMatchObject({
      script: null,
      cron: null,
      requestParams: null,
    });
  });

  it('user shall not see internal fields', async () => {
    const result = await runQuery(query, undefined, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.sources.nodes).toHaveLength(TOTAL_SOURCES);
    expect(result.data!.sources.nodes[0]).toMatchObject({
      script: null,
      cron: null,
      requestParams: null,
    });
  });

  it('editor shall not see internal fields', async () => {
    const result = await runQuery(query, undefined, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data!.sources.nodes).toHaveLength(TOTAL_SOURCES);
    expect(result.data!.sources.nodes[0]).toMatchObject({
      script: null,
      cron: null,
      requestParams: null,
    });
  });
});

describe('data', () => {
  it('should list sources', async () => {
    const result = await runQuery(query, undefined, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.sources.count).toBe(TOTAL_SOURCES);
    expect(result.data!.sources.nodes[0].id).toBeDefined();
    const snapshot = result.data!.sources.nodes.map(noTimestamps);
    expect(snapshot).toMatchSnapshot();
  });

  it('should be able to specify language', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.sources.count).toBe(TOTAL_SOURCES);
    const names = result.data!.sources.nodes.map((node: any) => node.name);
    expect(names).toEqual(expect.arrayContaining(['Галисия', 'Georgia']));
  });
});

describe('connections', () => {
  it('should count gauges', async () => {
    const gaugesQuery = `
      query listSources {
        sources {
          nodes {
            id
            name
            gauges {
              count
            }
          }
          count
        }
      }
    `;
    const result = await runQuery(gaugesQuery, undefined, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchSnapshot();
  });

  it('should count regions', async () => {
    const gaugesQuery = `
      query listSources {
        sources {
          nodes {
            id
            name
            regions {
              count
            }
          }
          count
        }
      }
    `;
    const result = await runQuery(gaugesQuery, undefined, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchSnapshot();
  });
});
