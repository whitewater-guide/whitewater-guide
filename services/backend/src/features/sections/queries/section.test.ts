import { ApolloErrorCodes } from '@whitewater-guide/commons';
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
  GALICIA_BECA_LOWER,
  GALICIA_BECA_UPPER,
  GEORGIA_BZHUZHA_EXTREME,
  GEORGIA_BZHUZHA_LONG,
  GEORGIA_BZHUZHA_QUALI,
  NORWAY_FINNA_GORGE,
  NORWAY_SJOA_AMOT,
  RUSSIA_MZYMTA_PASEKA,
} from '~/seeds/test/09_sections';
import { anonContext, fakeContext, noTimestamps, runQuery } from '~/test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query sectionDetails($id: ID){
    section(id: $id) {
      id
      name
      description
      season
      seasonNumeric
      levels {
        minimum
        maximum
        optimum
        impossible
        approximate
      }
      flows {
        minimum
        maximum
        optimum
        impossible
        approximate
      }
      flowsText
      putIn {
        id
        name
        description
        kind
        coordinates
      }
      takeOut {
        id
        name
        description
        kind
        coordinates
      }
      shape
      distance
      drop
      duration
      difficulty
      difficultyXtra
      rating
      tags {
        id
        name
      }
      createdAt
      createdBy {
        id
        name
      }
      updatedAt
      pois {
        id
        name
        description
        kind
        coordinates
      }
      hidden
      helpNeeded
      demo
      verified
    }
  }
`;

describe('permissions', () => {
  it('anon should not get hidden section', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_FINNA_GORGE },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not get hidden section', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_FINNA_GORGE },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not get hidden section', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_FINNA_GORGE },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('owning editor should get hidden section', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_FINNA_GORGE },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.hidden', true);
  });

  it('admin should get hidden section', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_FINNA_GORGE },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.hidden', true);
  });
});

describe('data', () => {
  it('should return simple data', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_SJOA_AMOT },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.section).toBeDefined();
    expect(noTimestamps(result.data!.section)).toMatchSnapshot();
  });

  it('should return river', async () => {
    const riverQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        river {
          id
          name
        }
      }
    }
  `;
    const result = await runQuery(riverQuery, { id: NORWAY_SJOA_AMOT });
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.river.name', 'Sjoa');
  });

  it('should return gauge', async () => {
    const gaugeQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        gauge {
          id
          name
        }
      }
    }
  `;
    const result = await runQuery(gaugeQuery, { id: GALICIA_BECA_LOWER });
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.gauge.name', 'Galicia gauge 1');
  });

  it('should return region', async () => {
    const regionQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        region {
          id
          name
        }
      }
    }
  `;
    const result = await runQuery(regionQuery, { id: NORWAY_SJOA_AMOT });
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.region.name', 'Norway');
  });

  it('should return media', async () => {
    const mediaQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        media {
          nodes {
            id
            url
          }
          count
        }
      }
    }
  `;
    const result = await runQuery(mediaQuery, { id: NORWAY_SJOA_AMOT });
    expect(result.errors).toBeUndefined();
    expect(result.data!.section.media.nodes).toHaveLength(4);
    expect(result.data!.section.media.count).toBe(4);
  });

  it('should return null when id not specified', async () => {
    const result = await runQuery(query, {});
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.section).toBeNull();
  });

  it('should return empty string for free region when description is null', async () => {
    const result = await runQuery(
      query,
      { id: GALICIA_BECA_UPPER },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.section.description).toBe('');
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(
      query,
      { id: NORWAY_SJOA_AMOT },
      fakeContext(EDITOR_NO_EC, 'ru'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.section).toMatchObject({
      name: 'Амот',
      description: 'Амот описание',
      distance: 3.2,
    });
  });

  it('should fall back to default language when not translated', async () => {
    const result = await runQuery(
      query,
      { id: RUSSIA_MZYMTA_PASEKA },
      fakeContext(EDITOR_NO_EC, 'pt'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.section).toMatchObject({
      name: 'Пасека',
      description: 'Пасека описание',
      distance: 2.2,
    });
  });
});

describe('premium access', () => {
  const descrQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        description
      }
    }
  `;

  it('should return null description when premium region is not purchased', async () => {
    const result = await runQuery(
      descrQuery,
      { id: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.description', null);
  });

  it('should return empty string description instead of null when premium is not purchased', async () => {
    const result = await runQuery(
      query,
      { id: GEORGIA_BZHUZHA_LONG },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.description', '');
  });

  it('should return empty string description instead of null when premium is purchased', async () => {
    const result = await runQuery(
      query,
      { id: GEORGIA_BZHUZHA_LONG },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.description', '');
  });

  it('should return demo section description when premium region is not purchased', async () => {
    const result = await runQuery(
      descrQuery,
      { id: GEORGIA_BZHUZHA_QUALI },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.section.description',
      'Bzhuzha Qualification description',
    );
  });

  it('should return description when premium region is purchased', async () => {
    const result = await runQuery(
      descrQuery,
      { id: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.section.description',
      'Bzhuzha Extreme race description',
    );
  });

  it('should return description when premium region is purchased as part of group', async () => {
    const result = await runQuery(
      descrQuery,
      { id: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(BOOM_USER_1500),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.section.description',
      'Bzhuzha Extreme race description',
    );
  });

  it('editor should see description even when not purchased region', async () => {
    const result = await runQuery(
      descrQuery,
      { id: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(EDITOR_GE),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.section.description',
      'Bzhuzha Extreme race description',
    );
  });

  it('admin should see description even when not purchased region', async () => {
    const result = await runQuery(
      descrQuery,
      { id: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.section.description',
      'Bzhuzha Extreme race description',
    );
  });
});
