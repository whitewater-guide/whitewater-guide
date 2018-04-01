import { holdTransaction, rollbackTransaction } from '../../../db';
import { BLOG_1, PHOTO_1, PHOTO_2 } from '../../../seeds/test/10_media';
import { userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';
import { ThumbResize } from '../../../ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query media($id: ID){
    media(id: $id) {
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
  const result = await runQuery(query, { id: PHOTO_1 }, userContext('ru'));
  expect(result).toHaveProperty('data.media.description', 'Фото 1 описание');
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(query, { id: PHOTO_2 }, userContext('ru'));
  expect(result).toHaveProperty('data.media.description', 'Photo 2 description');
});

it('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: PHOTO_1 }, userContext('pt'));
  expect(result).toHaveProperty('data.media.kind', 'photo');
});

it('should return thumb', async () => {
  const thumbQuery = `
    query media($id: ID, $thumbOpts: ThumbOptions){
      media(id: $id) {
        id
        thumb(options: $thumbOpts)
      }
    }`;
  const thumbOpts = { width: 100, height: 100, resize: ThumbResize.FIT };
  const result = await runQuery(thumbQuery, { id: PHOTO_1, thumbOpts });
  expect(result.data!.media.thumb).toMatch(/http:\/\/localhost:6001\/images\/[\w\-]+\/fit\/100\/100\/ce\/1\/[\w\-]+\.jpg/);
});

it('should produce correct full url for photos', async () => {
  const result = await runQuery(query, { id: PHOTO_1 });
  expect(result.data!.media.url).toBe(`http://localhost:6001/uploads/media/${PHOTO_1}`);
});

it('should preserve external url for non-photos', async () => {
  const result = await runQuery(query, { id: BLOG_1 });
  expect(result.data!.media.url).toBe('http://some.blog');
});
