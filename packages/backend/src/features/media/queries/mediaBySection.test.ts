import { anonContext } from '@test';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { NORWAY_SJOA_AMOT } from '~/seeds/test/09_sections';

import { testMediaBySection } from './mediaBySection.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query mediaBySection($sectionId: ID!) {
    mediaBySection(sectionId: $sectionId) {
      nodes {
        ...MediaCore
        size
        thumb: image(width: 100, height: 100)
      }
      count
    }
  }
`;

it('should return media', async () => {
  const result = await testMediaBySection({ sectionId: NORWAY_SJOA_AMOT });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.mediaBySection.nodes.length', 4);
  expect(result).toHaveProperty('data.mediaBySection.count', 4);
  expect(result.data?.mediaBySection).toMatchSnapshot();
});

it('should be able to specify language', async () => {
  const result = await testMediaBySection(
    { sectionId: NORWAY_SJOA_AMOT },
    anonContext('ru'),
  );
  expect(result.errors).toBeUndefined();
  const descriptions = result.data?.mediaBySection.nodes.map(
    (n: any) => n.description,
  );
  expect(descriptions).toEqual(
    expect.arrayContaining(['Фото 1 описание', 'Photo 2 description']),
  );
});
