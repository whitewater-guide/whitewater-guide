import { anonContext, runQuery } from '@test';

import { holdTransaction, rollbackTransaction } from '~/db';
import { NORWAY_SJOA_AMOT } from '~/seeds/test/09_sections';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query mediaBySection($sectionId: ID!){
    mediaBySection(sectionId: $sectionId) {
      nodes {
        id
        kind
        description
        copyright
        url
        image
        thumb: image(width: 100, height: 100)
        resolution
        weight
        size
      }
      count
    }
  }
`;

it('should return media', async () => {
  const result = await runQuery(query, { sectionId: NORWAY_SJOA_AMOT });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.mediaBySection.nodes.length', 4);
  expect(result).toHaveProperty('data.mediaBySection.count', 4);
  expect(result.data!.mediaBySection).toMatchSnapshot();
});

it('should be able to specify language', async () => {
  const result = await runQuery(
    query,
    { sectionId: NORWAY_SJOA_AMOT },
    anonContext('ru'),
  );
  expect(result.errors).toBeUndefined();
  const descriptions = result.data!.mediaBySection.nodes.map(
    (n: any) => n.description,
  );
  expect(descriptions).toEqual(
    expect.arrayContaining(['Фото 1 описание', 'Photo 2 description']),
  );
});
