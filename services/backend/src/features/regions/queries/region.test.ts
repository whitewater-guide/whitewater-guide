import db, { holdTransaction, rollbackTransaction } from '@db';
import {
  ADMIN,
  BOOM_USER_1500,
  EDITOR_GA_EC,
  EDITOR_GE,
  EDITOR_NO_EC,
  TEST_USER,
} from '@seeds/01_users';
import {
  REGION_GALICIA,
  REGION_GEORGIA,
  REGION_LAOS,
  REGION_NORWAY,
} from '@seeds/04_regions';
import { GEORGIA_BZHUZHA_LONG } from '@seeds/09_sections';
import {
  ALL_SECTION_ROW_BANNER,
  ALL_SECTION_ROW_BANNER_DISABLED,
  GALICIA_REGION_DESCR_BANNER,
  GALICIA_REGION_DESCR_BANNER2,
  GALICIA_SECTION_ROW_BANNER,
} from '@seeds/14_banners';
import { anonContext, fakeContext, noTimestamps, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query regionDetails($id: ID){
    region(id: $id) {
      id
      name
      description
      season
      seasonNumeric
      bounds
      hidden
      editable
      premium
      sku
      createdAt
      updatedAt
      pois {
        id
        name
        description
        kind
        coordinates
      }
    }
  }
`;

describe('permissions', () => {
  it('anons should not see hidden region', async () => {
    const result = await runQuery(query, { id: REGION_NORWAY }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('users should not see hidden region', async () => {
    const result = await runQuery(
      query,
      { id: REGION_NORWAY },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editors should not see hidden non-editable region', async () => {
    const result = await runQuery(
      query,
      { id: REGION_NORWAY },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editors should see hidden editable region', async () => {
    const result = await runQuery(
      query,
      { id: REGION_NORWAY },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.region.editable', true);
  });
});

describe('data', () => {
  it('should return null when id not specified', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.region).toBeNull();
  });

  it('should return region', async () => {
    const result = await runQuery(
      query,
      { id: REGION_GALICIA },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    const region = result.data!.region;
    expect(region.hidden).not.toBeNull();
    expect(noTimestamps(region)).toMatchSnapshot();
  });
});

describe('connections', () => {
  it('should get rivers', async () => {
    const riversQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        rivers {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
    const result = await runQuery(
      riversQuery,
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.rivers).toMatchSnapshot();
  });

  it('should paginate rivers', async () => {
    const riversQuery = `
    query regionDetails($id: ID, $page: Page){
      region(id: $id) {
        id
        name
        rivers(page: $page) {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
    const result = await runQuery(
      riversQuery,
      { id: REGION_GALICIA, page: { limit: 1, offset: 1 } },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.rivers.nodes).toHaveLength(1);
    expect(result.data!.region.rivers.count).toBe(2);
    expect(result).toHaveProperty(
      'data.region.rivers.nodes.0.name',
      'Gal_riv_two',
    );
  });

  it('should get gauges', async () => {
    const gaugesQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        gauges {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
    // Norway
    const result = await runQuery(
      gaugesQuery,
      { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.gauges.count).toEqual(6);
    expect(result.data!.region.gauges).toMatchSnapshot();
  });

  it('should paginate gauges', async () => {
    const gaugesQuery = `
    query regionDetails($id: ID, $page: Page){
      region(id: $id) {
        id
        name
        gauges(page: $page) {
          nodes {
            id
            name
          }
          count
        }
      }
    }
    `;
    // Norway
    const result = await runQuery(
      gaugesQuery,
      {
        id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
        page: { limit: 1, offset: 1 },
      },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.gauges.count).toBe(6);
    expect(result.data!.region.gauges.nodes).toHaveLength(1);
    expect(result).toHaveProperty(
      'data.region.gauges.nodes.0.name',
      'Galicia gauge 2',
    );
  });

  it('should get sources', async () => {
    const sectionsQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        sources {
          nodes {
            id
            name
          }
          count
        }
      }
    }
    `;
    const result = await runQuery(
      sectionsQuery,
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.sources.count).toEqual(2);
    expect(result.data!.region.sources).toMatchSnapshot();
  });

  it('should paginate sources', async () => {
    const sectionsQuery = `
    query regionDetails($id: ID, $page: Page){
      region(id: $id) {
        id
        name
        sources(page: $page) {
          nodes {
            id
            name
          }
          count
        }
      }
    }
    `;
    const result = await runQuery(
      sectionsQuery,
      { id: REGION_GALICIA, page: { limit: 1, offset: 1 } },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.sources.count).toEqual(2);
    expect(result.data!.region.sources.nodes).toHaveLength(1);
    expect(result).toHaveProperty(
      'data.region.sources.nodes.0.name',
      'Galicia2',
    );
  });

  it('should get sections', async () => {
    const sectionsQuery = `
      query regionDetails($id: ID){
        region(id: $id) {
          id
          name
          sections {
            nodes {
              id
              name
            }
            count
          }
        }
      }
    `;
    const result = await runQuery(
      sectionsQuery,
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.sections.count).toEqual(2);
    expect(result.data!.region.sections).toMatchSnapshot();
  });

  it('should paginate sections', async () => {
    const sectionsQuery = `
      query regionDetails($id: ID, $page: Page){
        region(id: $id) {
          id
          name
          sections(page: $page) {
            nodes {
              id
              name
            }
            count
          }
        }
      }
    `;
    const result = await runQuery(
      sectionsQuery,
      { id: REGION_GEORGIA, page: { limit: 1, offset: 1 } },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.data!.region.sections.count).toEqual(3);
    expect(result.data!.region.sections.nodes).toHaveLength(1);
    expect(result.data!.region.sections).toHaveProperty(
      'nodes.0.name',
      'Long Race',
    );
  });

  it('should filter recently updated sections', async () => {
    const sectionsQuery = `
      query regionDetails($id: ID, $filter: SectionsFilter){
        region(id: $id) {
          id
          name
          sections(filter: $filter) {
            nodes {
              id
              name
            }
            count
          }
        }
      }
    `;
    const [u2] = await db()
      .update({ rating: 1 })
      .from('sections')
      .where({ id: GEORGIA_BZHUZHA_LONG })
      .returning('updated_at');
    const result = await runQuery(
      sectionsQuery,
      { id: REGION_GEORGIA, filter: { updatedAfter: u2.toISOString() } },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.region.sections.nodes.length', 1);
    expect(result).toHaveProperty('data.region.sections.count', 1);
  });

  it('should fire two queries for region->sections->region', async () => {
    const sectionsQuery = `
    query regionDetails($id: ID) {
      region(id: $id) {
        id
        name
        sections {
          nodes {
            id
            name
            region {
              id
              name
            }
          }
          count
        }
      }
    }
    `;

    const queryMock = jest.fn();
    db().on('query', queryMock);
    await runQuery(sectionsQuery, { id: REGION_GEORGIA }, fakeContext(ADMIN));
    db().removeListener('query', queryMock);
    expect(queryMock).toHaveBeenCalledTimes(2);
  });

  it('should get media summary', async () => {
    const mediaSummaryQuery = `
      query regionDetails($id: ID){
        region(id: $id) {
          id
          name
          mediaSummary {
            photo {
              count
              size
            }
            video {
              count
              size
            }
            blog {
              count
              size
            }
          }
        }
      }
    `;
    const result = await runQuery(
      mediaSummaryQuery,
      { id: REGION_NORWAY },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.region).toMatchSnapshot();
  });

  it('should get media summary even when there is no media', async () => {
    const mediaSummaryQuery = `
      query regionDetails($id: ID){
        region(id: $id) {
          id
          name
          mediaSummary {
            photo {
              count
              size
            }
            video {
              count
              size
            }
            blog {
              count
              size
            }
          }
        }
      }
    `;
    const result = await runQuery(
      mediaSummaryQuery,
      { id: REGION_LAOS },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.region.mediaSummary).toEqual({
      photo: { count: 0, size: 0 },
      video: { count: 0, size: 0 },
      blog: { count: 0, size: 0 },
    });
  });

  describe('banners', () => {
    let result: any;
    const bannersQuery = `
      query regionDetails($id: ID){
        region(id: $id) {
          id
          name
          banners {
            nodes {
              id
              priority
              name
            }
            count
          }
        }
      }
    `;

    beforeEach(async () => {
      result = await runQuery(
        bannersQuery,
        { id: REGION_GALICIA },
        fakeContext(TEST_USER),
      );
      expect(result).not.toHaveGraphqlError();
    });

    it('should get all banners', async () => {
      expect(result.data!.region.banners.count).toBe(5);
      expect(result.data!.region.banners.nodes).toHaveLength(5);
      expect(result).toMatchSnapshot();
    });

    it('should get individual banners', async () => {
      expect(result.data!.region.banners.nodes).toContainEqual({
        id: GALICIA_SECTION_ROW_BANNER,
        name: 'galicia section row banner',
        priority: 1,
      });
    });

    it('should get group banners', () => {
      expect(result.data!.region.banners.nodes).toContainEqual({
        id: ALL_SECTION_ROW_BANNER,
        name: 'all section row banner',
        priority: 10,
      });
    });

    it('should prioritize individual banners over group banners', () => {
      expect(result.data!.region.banners.nodes).toMatchObject([
        { id: GALICIA_REGION_DESCR_BANNER2, priority: 10 },
        { id: GALICIA_SECTION_ROW_BANNER, priority: 1 },
        { id: GALICIA_REGION_DESCR_BANNER, priority: 1 },
        { id: ALL_SECTION_ROW_BANNER_DISABLED, priority: 20 },
        { id: ALL_SECTION_ROW_BANNER, priority: 10 },
      ]);
    });
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(
      query,
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC, 'ru'),
    );
    expect(result.data!.region.name).toBe('Галисия');
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(
      query,
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC, 'pt'),
    );
    expect(result.data!.region.name).toBe('Galicia');
  });

  it('should be able to get basic attributes without translation', async () => {
    const result = await runQuery(
      query,
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC, 'pt'),
    );
    expect(result.data!.region.seasonNumeric).toEqual([20, 21]);
  });
});

describe('premium access', () => {
  const premiumQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        hasPremiumAccess
      }
    }
  `;

  it('false when not purchased', async () => {
    const result = await runQuery(
      premiumQuery,
      { id: REGION_GEORGIA },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', false);
  });

  it('true when purchases as single region', async () => {
    const result = await runQuery(
      premiumQuery,
      { id: REGION_GEORGIA },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });

  it('true when purchases as part of group', async () => {
    const result = await runQuery(
      premiumQuery,
      { id: REGION_GEORGIA },
      fakeContext(BOOM_USER_1500),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });

  it('true for admin', async () => {
    const result = await runQuery(
      premiumQuery,
      { id: REGION_GEORGIA },
      fakeContext(ADMIN),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });

  it('true for editor', async () => {
    const result = await runQuery(
      premiumQuery,
      { id: REGION_GEORGIA },
      fakeContext(EDITOR_GE),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });
});
