import { holdTransaction, rollbackTransaction } from '../../../db';
import { NORWAY_SJOA_AMOT } from '../../../seeds/test/08_sections';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query mediaBySection($sectionId: ID!, $language: String){
    mediaBySection(sectionId: $sectionId, language: $language) {
      nodes {
        id
        language
        kind
        description
        copyright
        url
        resolution
        weight
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
  expect(noTimestamps(result)).toMatchSnapshot();
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { sectionId: NORWAY_SJOA_AMOT, language: 'ru' });
  expect(result.errors).toBeUndefined();
  const descriptions = result.data!.mediaBySection.nodes.map((n: any) => n.description);
  expect(descriptions).toEqual(expect.arrayContaining(['Фото 1 описание', 'Not translated']));
});