import { anonContext, fakeContext, noTimestamps } from '@test';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import {
  SOURCE_GALICIA_1,
  SOURCE_NORWAY,
  SOURCE_RUSSIA,
} from '~/seeds/test/05_sources';
import {
  GAUGE_GAL_1_1,
  GAUGE_GAL_1_2,
  GAUGE_NOR_2,
} from '~/seeds/test/06_gauges';

import {
  testSourceDetails,
  testSourceGauges,
  testSourceRegions,
} from './source.test.generated';

jest.mock('../../gorge/connector');

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query sourceDetails($id: ID) {
    source(id: $id) {
      ...SourceCore
      requestParams
      enabled
      ...TimestampedMeta
    }
  }
`;

describe('permissions', () => {
  it('anon shall not see internal fields', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_GALICIA_1 },
      anonContext(),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.source).toMatchObject({
      cron: null,
      requestParams: null,
    });
  });

  it('user shall not see internal fields', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_GALICIA_1 },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.source).toMatchObject({
      cron: null,
      requestParams: null,
    });
  });

  it('editor shall not see internal fields', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_GALICIA_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.source).toMatchObject({
      cron: null,
      requestParams: null,
    });
  });
});

describe('data', () => {
  it('should return source', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.source?.id).toBe(SOURCE_GALICIA_1);
    expect(noTimestamps(result.data?.source)).toMatchSnapshot();
  });

  it('should return null when id not specified', async () => {
    const result = await testSourceDetails({}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.source).toBeNull();
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN, 'ru'),
    );
    expect(result.data?.source).toMatchObject({
      name: 'Галисия',
      cron: '0 * * * *',
    });
  });

  it('should fall back to english when not translated', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN, 'fr'),
    );
    expect(result.data?.source).toMatchObject({
      name: 'Galicia',
      cron: '0 * * * *',
    });
  });

  it('should fall back to default language when both desired and english translations are not provided', async () => {
    const result = await testSourceDetails(
      { id: SOURCE_RUSSIA },
      fakeContext(ADMIN, 'pt'),
    );
    expect(result.data?.source).toMatchObject({
      name: 'Россия',
      requestParams: { foo: 'bar' },
    });
  });
});

describe('connections', () => {
  describe('regions', () => {
    const _q = gql`
      query sourceRegions($id: ID, $regionsPage: Page) {
        source(id: $id) {
          id
          regions(page: $regionsPage) {
            count
            nodes {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;

    it('should return nodes', async () => {
      const result = await testSourceRegions(
        { id: SOURCE_GALICIA_1 },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.source).toMatchObject({
        id: SOURCE_GALICIA_1,
        regions: {
          count: 2,
          nodes: [
            { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', name: 'Galicia' },
            { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34', name: 'Norway' },
          ],
        },
      });
    });

    it('should paginate', async () => {
      const result = await testSourceRegions(
        { id: SOURCE_GALICIA_1, regionsPage: { limit: 1, offset: 1 } },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.source).toMatchObject({
        id: SOURCE_GALICIA_1,
        regions: {
          count: 2,
          nodes: [
            { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34', name: 'Norway' },
          ],
        },
      });
    });
  });

  describe('gauges', () => {
    const _q = gql`
      query sourceGauges($id: ID, $page: Page) {
        source(id: $id) {
          id
          gauges(page: $page) {
            count
            nodes {
              id
              code
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;

    it('should return nodes', async () => {
      const result = await testSourceGauges(
        { id: SOURCE_GALICIA_1 },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.source?.gauges.count).toBe(2);
      expect(result.data?.source?.gauges.nodes).toHaveLength(2);
      expect(result.data?.source?.gauges.nodes).toMatchObject([
        {
          id: GAUGE_GAL_1_1,
          code: 'gal1',
        },
        {
          id: GAUGE_GAL_1_2,
          code: 'gal2',
        },
      ]);
    });

    it('should paginate', async () => {
      const result = await testSourceGauges(
        { id: SOURCE_NORWAY, page: { limit: 1, offset: 1 } },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.source?.gauges.count).toBe(4);
      expect(result.data?.source?.gauges.nodes).toHaveLength(1);
      expect(result.data?.source?.gauges.nodes).toMatchObject([
        { id: GAUGE_NOR_2, code: 'nor2' },
      ]);
    });
  });
});
