import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { matrixClient } from '../../../features/chats/index';
import {
  ADMIN,
  BOOM_USER_1500,
  EDITOR_GA_EC,
  EDITOR_GE,
  EDITOR_NO_EC,
  TEST_USER,
} from '../../../seeds/test/01_users';
import {
  REGION_GALICIA,
  REGION_GEORGIA,
  REGION_LAOS,
  REGION_NORWAY,
  REGION_RUSSIA,
} from '../../../seeds/test/04_regions';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/06_gauges';
import { GEORGIA_BZHUZHA_LONG } from '../../../seeds/test/09_sections';
import {
  ALL_SECTION_ROW_BANNER,
  ALL_SECTION_ROW_BANNER_DISABLED,
  GALICIA_REGION_DESCR_BANNER,
  GALICIA_REGION_DESCR_BANNER2,
  GALICIA_SECTION_ROW_BANNER,
} from '../../../seeds/test/14_banners';
import { anonContext, fakeContext, noTimestamps } from '../../../test/index';
import {
  testPollRegionMeasurements,
  testPollRegionMeasurementsLegacy,
  testRegionBanners,
  testRegionCover,
  testRegionDetails,
  testRegionDetailsPremium,
  testRegionGauges,
  testRegionMediaSummary,
  testRegionRivers,
  testRegionRoom,
  testRegionSections,
  testRegionSectionsRegion,
  testRegionSources,
} from './region.test.generated';

jest.mock('../../gorge/connector');
jest.mock('../../chats/MatrixClient');

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

const _query = gql`
  query regionDetails($id: ID) {
    region(id: $id) {
      ...RegionCore
      description
      bounds
      hidden
      mapsSize
      editable
      premium
      sku
      ...RegionLicense
      ...TimestampedMeta
      ...RegionPOIs
    }
  }
`;

describe('permissions', () => {
  it('anons should not see hidden region', async () => {
    const result = await testRegionDetails(
      { id: REGION_NORWAY },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('users should not see hidden region', async () => {
    const result = await testRegionDetails(
      { id: REGION_NORWAY },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editors should not see hidden non-editable region', async () => {
    const result = await testRegionDetails(
      { id: REGION_NORWAY },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editors should see hidden editable region', async () => {
    const result = await testRegionDetails(
      { id: REGION_NORWAY },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.region.editable', true);
  });
});

describe('data', () => {
  const _q = gql`
    query regionCover($id: ID) {
      region(id: $id) {
        id
        __typename
        coverImage {
          __typename
          mobile
          thumb: mobile(width: 640)
        }
      }
    }
  `;

  it('should return null when id not specified', async () => {
    const result = await testRegionDetails({}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.region).toBeNull();
  });

  it('should return region', async () => {
    const result = await testRegionDetails(
      { id: REGION_GALICIA },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.region?.hidden).not.toBeNull();
    expect(noTimestamps(result.data?.region)).toMatchSnapshot();
  });

  it('should return full cover and thumb', async () => {
    const result = await testRegionCover(
      { id: REGION_GALICIA },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.region?.coverImage.mobile).toBe(
      'imgproxy://covers/galicia_mobile_cover.jpg',
    );
    expect(result.data?.region?.coverImage.thumb).toBe(
      'imgproxy://w:640/covers/galicia_mobile_cover.jpg',
    );
  });
});

describe('connections', () => {
  describe('rivers', () => {
    const _q = gql`
      query regionRivers($id: ID, $page: Page) {
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

    it('should get rivers', async () => {
      const result = await testRegionRivers(
        { id: REGION_GALICIA },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.data?.region?.rivers).toMatchSnapshot();
    });

    it('should paginate rivers', async () => {
      const result = await testRegionRivers(
        { id: REGION_GALICIA, page: { limit: 1, offset: 1 } },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.data?.region?.rivers.nodes).toHaveLength(1);
      expect(result.data?.region?.rivers.count).toBe(2);
      expect(result).toHaveProperty('data.region.rivers.nodes.0.name', 'Cabe');
    });
  });

  describe('gauges', () => {
    const _q = gql`
      query regionGauges($id: ID, $page: Page) {
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

    it('should get gauges', async () => {
      const result = await testRegionGauges(
        { id: REGION_GEORGIA },
        fakeContext(ADMIN),
      );
      expect(result.data?.region?.gauges.count).toEqual(2);
      expect(result.data?.region?.gauges).toMatchSnapshot();
    });

    it('should paginate gauges', async () => {
      const result = await testRegionGauges(
        {
          id: REGION_GEORGIA,
          page: { limit: 1, offset: 1 },
        },
        fakeContext(ADMIN),
      );
      expect(result.data?.region?.gauges.count).toBe(2);
      expect(result.data?.region?.gauges.nodes).toHaveLength(1);
      expect(result).toHaveProperty(
        'data.region.gauges.nodes.0.name',
        'Georgian gauge 4',
      );
    });
  });

  describe('sources', () => {
    const _q = gql`
      query regionSources($id: ID, $page: Page) {
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

    it('should get sources', async () => {
      const result = await testRegionSources(
        { id: REGION_GALICIA },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.data?.region?.sources.count).toEqual(2);
      expect(result.data?.region?.sources).toMatchSnapshot();
    });

    it('should paginate sources', async () => {
      const result = await testRegionSources(
        { id: REGION_GALICIA, page: { limit: 1, offset: 1 } },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.data?.region?.sources.count).toEqual(2);
      expect(result.data?.region?.sources.nodes).toHaveLength(1);
      expect(result).toHaveProperty(
        'data.region.sources.nodes.0.name',
        'Galicia2',
      );
    });
  });

  describe('sections', () => {
    const _q = gql`
      query regionSections(
        $id: ID
        $page: Page
        $filter: SectionsFilter
        $updatedAfter: DateTime
      ) {
        region(id: $id) {
          id
          name
          sections(page: $page, filter: $filter, updatedAfter: $updatedAfter) {
            nodes {
              id
              name
            }
            count
          }
        }
      }
    `;

    it('should get sections', async () => {
      const result = await testRegionSections(
        { id: REGION_GALICIA },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.data?.region?.sections.count).toEqual(2);
      expect(result.data?.region?.sections).toMatchSnapshot();
    });

    it('should paginate sections', async () => {
      const result = await testRegionSections(
        { id: REGION_GEORGIA, page: { limit: 1, offset: 1 } },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.data?.region?.sections.count).toEqual(3);
      expect(result.data?.region?.sections.nodes).toHaveLength(1);
      expect(result.data?.region?.sections).toHaveProperty(
        'nodes.0.name',
        'Long Race',
      );
    });

    it('should filter recently updated sections', async () => {
      const [{ updated_at }] = await db()
        .update({ rating: 1 })
        .from('sections')
        .where({ id: GEORGIA_BZHUZHA_LONG })
        .returning('updated_at');
      const u2 = new Date(updated_at.getTime() - 300);
      const result = await testRegionSections(
        {
          id: REGION_GEORGIA,
          updatedAfter: u2.toISOString() as any,
        },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.errors).toBeUndefined();
      expect(result).toHaveProperty('data.region.sections.nodes.length', 1);
      expect(result).toHaveProperty('data.region.sections.count', 1);
    });

    it('should filter recently updated sections (legacy, in filter)', async () => {
      const [{ updated_at }] = await db()
        .update({ rating: 1 })
        .from('sections')
        .where({ id: GEORGIA_BZHUZHA_LONG })
        .returning('updated_at');
      const u2 = new Date(updated_at.getTime() - 300);
      const result = await testRegionSections(
        {
          id: REGION_GEORGIA,
          filter: { updatedAfter: u2.toISOString() as any },
        },
        fakeContext(EDITOR_NO_EC),
      );
      expect(result.errors).toBeUndefined();
      expect(result).toHaveProperty('data.region.sections.nodes.length', 1);
      expect(result).toHaveProperty('data.region.sections.count', 1);
    });

    it('should fire two queries for region->sections->region', async () => {
      const _q2 = gql`
        query regionSectionsRegion($id: ID) {
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
      await testRegionSectionsRegion(
        { id: REGION_GEORGIA },
        fakeContext(ADMIN),
      );
      db().removeListener('query', queryMock);
      expect(queryMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('media summary', () => {
    const _q = gql`
      query regionMediaSummary($id: ID) {
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
            maps {
              count
              size
            }
          }
        }
      }
    `;

    it('should get media summary', async () => {
      const result = await testRegionMediaSummary(
        { id: REGION_NORWAY },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.region).toMatchSnapshot();
    });

    it('should get media summary even when there is no media', async () => {
      const result = await testRegionMediaSummary(
        { id: REGION_LAOS },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.region?.mediaSummary).toEqual({
        photo: { count: 0, size: 0 },
        video: { count: 0, size: 0 },
        blog: { count: 0, size: 0 },
        maps: { count: 0, size: 2222222 },
      });
    });
  });

  describe('banners', () => {
    let result: any;
    const _q = gql`
      query regionBanners($id: ID) {
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
      result = await testRegionBanners(
        { id: REGION_GALICIA },
        fakeContext(TEST_USER),
      );
    });

    it('should get all banners', () => {
      expect(result).not.toHaveGraphqlError();
      expect(result.data?.region?.banners.count).toBe(5);
      expect(result.data?.region?.banners.nodes).toHaveLength(5);
      expect(result.data?.region).toMatchSnapshot();
    });

    it('should get individual banners', () => {
      expect(result.data?.region?.banners.nodes).toContainEqual({
        id: GALICIA_SECTION_ROW_BANNER,
        name: 'galicia section row banner',
        priority: 1,
      });
    });

    it('should get group banners', () => {
      expect(result.data?.region?.banners.nodes).toContainEqual({
        id: ALL_SECTION_ROW_BANNER,
        name: 'all section row banner',
        priority: 10,
      });
    });

    it('should prioritize individual banners over group banners', () => {
      expect(result.data?.region?.banners.nodes).toMatchObject([
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
    const result = await testRegionDetails(
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC, 'ru'),
    );
    expect(result.data?.region?.name).toBe('Галисия');
  });

  it('should fall back to english when not translated', async () => {
    const result = await testRegionDetails(
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC, 'pt'),
    );
    expect(result.data?.region?.name).toBe('Galicia');
  });

  it('should be able to get basic attributes without translation', async () => {
    const result = await testRegionDetails(
      { id: REGION_GALICIA },
      fakeContext(EDITOR_NO_EC, 'pt'),
    );
    expect(result.data?.region?.seasonNumeric).toEqual([20, 21]);
  });
});

describe('premium access', () => {
  const _q = gql`
    query regionDetailsPremium($id: ID) {
      region(id: $id) {
        id
        hasPremiumAccess
      }
    }
  `;

  it('false when not purchased', async () => {
    const result = await testRegionDetailsPremium(
      { id: REGION_GEORGIA },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', false);
  });

  it('true when purchases as single region', async () => {
    const result = await testRegionDetailsPremium(
      { id: REGION_GEORGIA },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });

  it('true when purchases as part of group', async () => {
    const result = await testRegionDetailsPremium(
      { id: REGION_GEORGIA },
      fakeContext(BOOM_USER_1500),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });

  it('true for admin', async () => {
    const result = await testRegionDetailsPremium(
      { id: REGION_GEORGIA },
      fakeContext(ADMIN),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });

  it('true for editor', async () => {
    const result = await testRegionDetailsPremium(
      { id: REGION_GEORGIA },
      fakeContext(EDITOR_GE),
    );
    expect(result).toHaveProperty('data.region.hasPremiumAccess', true);
  });
});

it('should not fail on poll measurements query', async () => {
  const _q = gql`
    query pollRegionMeasurements($id: ID) {
      region(id: $id) {
        id
        gauges {
          nodes {
            id
            latestMeasurement {
              flow
              level
              timestamp
            }
          }
        }
      }
    }
  `;
  const result = await testPollRegionMeasurements(
    { id: REGION_GALICIA },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data).toMatchObject({
    region: {
      gauges: {
        nodes: [
          {
            id: GAUGE_GAL_1_1,
            latestMeasurement: {
              flow: null,
              level: 1.2,
              timestamp: expect.any(Date),
            },
          },
        ],
      },
      id: REGION_GALICIA,
    },
  });
});

it('should not fail on legacy poll measurements query', async () => {
  // the difference is that instead of latestMeasurement it uses depreacted lastMeasurement
  const _q = gql`
    query pollRegionMeasurementsLegacy($id: ID) {
      region(id: $id) {
        id
        gauges {
          nodes {
            id
            lastMeasurement {
              flow
              level
              timestamp
            }
          }
        }
      }
    }
  `;
  const result = await testPollRegionMeasurementsLegacy(
    { id: REGION_GALICIA },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data).toMatchObject({
    region: {
      gauges: {
        nodes: [
          {
            id: GAUGE_GAL_1_1,
            lastMeasurement: {
              flow: null,
              level: 1.2,
              timestamp: expect.any(Date),
            },
          },
        ],
      },
      id: REGION_GALICIA,
    },
  });
});

describe('chat room', () => {
  const _q = gql`
    query regionRoom($id: ID) {
      region(id: $id) {
        id
        room {
          id
          alias
        }
      }
    }
  `;

  it('should lazily create synapse room', async () => {
    const createRoomSpy = jest.spyOn(matrixClient, 'createRoom');
    const result = await testRegionRoom(
      { id: REGION_GALICIA },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      region: {
        id: REGION_GALICIA,
        room: {
          id: `!__new_room_id__:whitewater.guide`,
          alias: `#${REGION_GALICIA}:whitewater.guide`,
        },
      },
    });
    expect(createRoomSpy).toHaveBeenCalled();
  });

  it('should return existing room', async () => {
    const createRoomSpy = jest.spyOn(matrixClient, 'createRoom');
    const result = await testRegionRoom(
      { id: REGION_RUSSIA },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      region: {
        id: REGION_RUSSIA,
        room: {
          id: `!room_russia:whitewater.guide`,
          alias: `#${REGION_RUSSIA}:whitewater.guide`,
        },
      },
    });
    expect(createRoomSpy).not.toHaveBeenCalled();
  });
});
