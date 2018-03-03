import { holdTransaction, rollbackTransaction } from '../../../db';
import { PHOTO_1 } from '../../../seeds/development/10_media';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query media($id: ID, $language: String){
    media(id: $id, language: $language) {
      id
      kind
      description
      copyright
      url
      resolution
      weight
    }
  }
`;

it('should return media', async () => {
  const result = await runQuery(query, { id: PHOTO_1 });
  expect(result.errors).toBeUndefined();
  const media = result.data!.media;
  expect(noTimestamps(media)).toMatchSnapshot();
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.media).toBeNull();
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { id: PHOTO_1, language: 'ru' });
  expect(result).toHaveProperty('data.media.description', 'Фото 1 описание');
});

it('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: PHOTO_1, language: 'pt' });
  expect(result).toHaveProperty('data.media.kind', 'photo');
});

it.skip('should produce correct full url', async () => {
  // Not implemented yet
});
