import { anonContext, fakeContext, noTimestamps } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

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

import {
  testSectionDetails,
  testSectionGauge,
  testSectionMedia,
  testSectionPremium,
  testSectionRegion,
  testSectionRiver,
} from './section.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query sectionDetails($id: ID) {
    section(id: $id) {
      ...SectionCore
      description
      ...SectionEnds
      shape
      ...SectionFlows
      ...SectionTags
      ...SectionLicense
      ...SectionPOIs
      ...TimestampedMeta
      createdBy {
        id
        name
      }
    }
  }
`;

describe('permissions', () => {
  it('anon should not get hidden section', async () => {
    const result = await testSectionDetails(
      { id: NORWAY_FINNA_GORGE },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not get hidden section', async () => {
    const result = await testSectionDetails(
      { id: NORWAY_FINNA_GORGE },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not get hidden section', async () => {
    const result = await testSectionDetails(
      { id: NORWAY_FINNA_GORGE },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('owning editor should get hidden section', async () => {
    const result = await testSectionDetails(
      { id: NORWAY_FINNA_GORGE },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.hidden', true);
  });

  it('admin should get hidden section', async () => {
    const result = await testSectionDetails(
      { id: NORWAY_FINNA_GORGE },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.hidden', true);
  });
});

describe('data', () => {
  it('should return simple data', async () => {
    const result = await testSectionDetails(
      { id: NORWAY_SJOA_AMOT },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.section).toBeDefined();
    expect(noTimestamps(result.data?.section)).toMatchSnapshot();
  });

  it('should return river', async () => {
    const _q = gql`
      query sectionRiver($id: ID) {
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
    const result = await testSectionRiver({ id: NORWAY_SJOA_AMOT });
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.river.name', 'Sjoa');
  });

  it('should return gauge', async () => {
    const _q = gql`
      query sectionGauge($id: ID) {
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
    const result = await testSectionGauge({ id: GALICIA_BECA_LOWER });
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.gauge.name', 'Galicia gauge 1');
  });

  it('should return region', async () => {
    const _q = gql`
      query sectionRegion($id: ID) {
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
    const result = await testSectionRegion({ id: NORWAY_SJOA_AMOT });
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.region.name', 'Norway');
  });

  it('should return media', async () => {
    const _q = gql`
      query sectionMedia($id: ID) {
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
    const result = await testSectionMedia({ id: NORWAY_SJOA_AMOT });
    expect(result.errors).toBeUndefined();
    expect(result.data?.section?.media.nodes).toHaveLength(4);
    expect(result.data?.section?.media.count).toBe(4);
  });

  it('should return null when id not specified', async () => {
    const result = await testSectionDetails({});
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.section).toBeNull();
  });

  it('should return empty string for free region when description is null', async () => {
    const result = await testSectionDetails(
      { id: GALICIA_BECA_UPPER },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.section?.description).toBe('');
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await testSectionDetails(
      { id: GALICIA_BECA_LOWER },
      fakeContext(ADMIN, 'ru'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.section).toMatchObject({
      description: 'Нижняя Беса описание',
      distance: 11.1,
      name: 'Нижняя',
      pois: [
        {
          name: 'Нижняя Беса Порог',
        },
        {
          name: 'Lower Beca Portage',
        },
      ],
    });
  });

  it('should fall back to english when not translated', async () => {
    const result = await testSectionDetails(
      { id: GALICIA_BECA_LOWER },
      fakeContext(ADMIN, 'fr'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.section).toMatchObject({
      description: 'Lower Beca description',
      distance: 11.1,
      name: 'Lower',
      pois: [
        {
          name: 'Lower Beca Rapid',
        },
        {
          name: 'Lower Beca Portage',
        },
      ],
    });
  });

  it('should fall back to default language when both desired and english translations are not provided', async () => {
    const result = await testSectionDetails(
      { id: RUSSIA_MZYMTA_PASEKA },
      fakeContext(TEST_USER, 'pt'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.section).toMatchObject({
      name: 'Пасека',
      description: 'Пасека описание',
      distance: 2.2,
      pois: [{ name: 'Обнос прорыва' }],
      favorite: true,
    });
  });
});

describe('premium access', () => {
  const _q = gql`
    query sectionPremium($id: ID) {
      section(id: $id) {
        id
        description
      }
    }
  `;

  it('should return null description when premium region is not purchased', async () => {
    const result = await testSectionPremium(
      { id: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.description', null);
  });

  it('should return empty string description instead of null when premium is not purchased', async () => {
    const result = await testSectionDetails(
      { id: GEORGIA_BZHUZHA_LONG },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.description', '');
  });

  it('should return empty string description instead of null when premium is purchased', async () => {
    const result = await testSectionDetails(
      { id: GEORGIA_BZHUZHA_LONG },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.description', '');
  });

  it('should return demo section description when premium region is not purchased', async () => {
    const result = await testSectionPremium(
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
    const result = await testSectionPremium(
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
    const result = await testSectionPremium(
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
    const result = await testSectionPremium(
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
    const result = await testSectionPremium(
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
