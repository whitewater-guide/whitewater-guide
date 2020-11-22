import countBy from 'lodash/countBy';
import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  BOOM_USER_1500,
  EDITOR_GA_EC,
  EDITOR_GE,
  EDITOR_NO_EC,
  TEST_USER,
  TEST_USER2,
} from '~/seeds/test/01_users';
import {
  NUM_REGIONS,
  REGION_ECUADOR,
  REGION_GALICIA,
  REGION_GEORGIA,
  REGION_NORWAY,
} from '~/seeds/test/04_regions';
import { anonContext, fakeContext, noTimestamps, runQuery } from '~/test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listRegions($page: Page){
    regions(page: $page) {
      nodes {
        id
        name
        description
        season
        seasonNumeric
        bounds
        hidden
        premium
        sku
        editable
        createdAt
        updatedAt
        pois {
          id
          name
          description
          kind
          coordinates
        }
        coverImage {
          mobile
        }
      }
      count
    }
  }
`;

describe('permissions', () => {
  it('editor should see his editable regions', async () => {
    // Cannot see hidden region Laos which he cannot edit
    // But can see hidden region Norway which he can edit
    const result = await runQuery(query, undefined, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(countBy(result.data!.regions.nodes, 'editable')).toMatchObject({
      true: 2,
      false: 4,
    });
  });

  it('editor should not see hidden regions without permission', async () => {
    const result = await runQuery(query, undefined, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data!.regions.count).toBe(5);
    expect(result.data!.regions.nodes).not.toContainEqual(
      expect.objectContaining({ id: REGION_NORWAY }),
    );
  });

  it('anons should not see hidden regions', async () => {
    const result = await runQuery(query, {}, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.regions.count).toBe(5);
    expect(result.data!.regions.nodes).toHaveLength(5);
    expect(result.data!.regions.nodes[0].hidden).toBe(null);
  });

  it('users should not see hidden regions', async () => {
    const result = await runQuery(query, {}, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.regions.count).toBe(5);
    expect(result.data!.regions.nodes).toHaveLength(5);
    expect(result.data!.regions.nodes[0].hidden).toBe(null);
  });
});

describe('results', () => {
  it('admin should get all regions', async () => {
    const result = await runQuery(query, undefined, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    const regions = result.data!.regions;
    expect(regions.count).toBe(NUM_REGIONS);
    expect(regions.nodes.length).toBe(NUM_REGIONS);
    expect(regions.nodes.map(noTimestamps)).toMatchSnapshot();
  });

  it('should return rivers count', async () => {
    const riversQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          name
          rivers { count }
        }
        count
      }
    }
  `;
    const result = await runQuery(riversQuery, {}, fakeContext(ADMIN));
    expect(result.data!.regions).toBeDefined();
    const regions = result.data!.regions;
    expect(regions.count).toBe(NUM_REGIONS);
    // Check name
    expect(result.data!.regions.nodes).toMatchObject([
      { rivers: { count: 1 } }, // Ecuador
      { rivers: { count: 2 } }, // galicia
      { rivers: { count: 1 } }, // georgia
      { rivers: { count: 0 } }, // laos
      { rivers: { count: 2 } }, // norway
      { rivers: { count: 0 } }, // other
      { rivers: { count: 1 } }, // russia
    ]);
  });

  it('should return gauges count', async () => {
    const gaugesQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          name
          gauges { count }
        }
        count
      }
    }
  `;
    const result = await runQuery(gaugesQuery, {}, fakeContext(ADMIN));
    expect(result.data!.regions).toBeDefined();
    expect(result.data!.regions.nodes).toMatchObject([
      { gauges: { count: 0 } }, // Ecuador
      { gauges: { count: 1 } }, // galicia
      { gauges: { count: 2 } }, // georgia
      { gauges: { count: 0 } }, // laos
      { gauges: { count: 1 } }, // norway
      { gauges: { count: 0 } }, // others
      { gauges: { count: 0 } }, // russia
    ]);
  });

  it('should return sections count', async () => {
    const gaugesQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          name
          sections { count }
        }
        count
      }
    }
  `;
    const result = await runQuery(gaugesQuery, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.regions).toBeDefined();
    const regions = result.data!.regions.nodes;
    // At least one region should have some sections
    expect(regions.some((r: any) => r.sections.count > 0)).toBe(true);
  });

  it('should search by name', async () => {
    const searchQuery = `
      query listRegions($filter: RegionFilterOptions, $page: Page){
        regions(filter: $filter, page: $page) {
          nodes {
            id
            name
          }
        }
      }
    `;

    const result = await runQuery(
      searchQuery,
      { filter: { searchString: 'Or' } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    const regions = result.data!.regions;
    expect(regions.nodes).toHaveLength(3);
    expect(regions.nodes).toContainEqual(
      expect.objectContaining({
        id: REGION_NORWAY,
      }),
    );
    expect(regions.nodes).not.toContainEqual(
      expect.objectContaining({
        id: REGION_GALICIA,
      }),
    );
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    const regions = result.data!.regions;
    expect(regions.count).toBe(NUM_REGIONS);
    expect(regions.nodes).toContainEqual(
      expect.objectContaining({ name: 'Галисия' }),
    );
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    const regions = result.data!.regions;
    expect(regions.count).toBe(NUM_REGIONS);
    expect(regions.nodes).toContainEqual(
      expect.objectContaining({ name: 'Norway' }),
    );
  });
});

describe('premium access', () => {
  const premiumQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          hasPremiumAccess
        }
        count
      }
    }
  `;

  it('without purchases', async () => {
    const result = await runQuery(premiumQuery, {}, fakeContext(TEST_USER2));
    expect(result.data!.regions.nodes).not.toContainEqual(
      expect.objectContaining({ hasPremiumAccess: true }),
    );
  });

  it('with single region purchased', async () => {
    const result = await runQuery(
      premiumQuery,
      {},
      fakeContext(TEST_USER, 'en'),
    );
    expect(result.data!.regions.nodes).toEqual(
      expect.arrayContaining([
        { id: REGION_ECUADOR, hasPremiumAccess: false }, // invalid transaction
        { id: REGION_GEORGIA, hasPremiumAccess: true }, // valid transaction
      ]),
    );
  });

  it('with group of regions purchased', async () => {
    const result = await runQuery(
      premiumQuery,
      {},
      fakeContext(BOOM_USER_1500, 'en'),
    );
    expect(result.data!.regions.nodes).toEqual(
      expect.arrayContaining([
        { id: REGION_ECUADOR, hasPremiumAccess: false },
        { id: REGION_GEORGIA, hasPremiumAccess: true },
      ]),
    );
  });

  it('admin should always have premium access', async () => {
    const result = await runQuery(premiumQuery, {}, fakeContext(ADMIN));
    expect(result.data!.regions.nodes).not.toContainEqual(
      expect.objectContaining({ hasPremiumAccess: false }),
    );
  });

  it('editor should always have premium access', async () => {
    const result = await runQuery(premiumQuery, {}, fakeContext(EDITOR_GE));
    expect(result.data!.regions.nodes).toEqual(
      expect.arrayContaining([
        { id: REGION_ECUADOR, hasPremiumAccess: false },
        { id: REGION_GEORGIA, hasPremiumAccess: true },
      ]),
    );
  });
});
