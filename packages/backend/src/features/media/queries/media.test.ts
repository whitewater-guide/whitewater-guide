import { anonContext } from '@test';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { BLOG_1, PASEKA_BLOG_1, PHOTO_1, VIDEO_1 } from '~/seeds/test/11_media';

import { testMedia } from './media.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query media($id: ID) {
    media(id: $id) {
      ...MediaCore
      image
      thumb: image(width: 100, height: 100)
    }
  }
`;

it('should return media', async () => {
  const result = await testMedia({ id: PHOTO_1 });
  expect(result.errors).toBeUndefined();
  expect(result.data?.media).toEqual({
    copyright: 'Photo 1 copyright',
    description: 'Photo 1 description',
    id: PHOTO_1,
    image: 'imgproxy://media/a32664ca-1ee5-11e8-b467-0ed5f89f718b',
    kind: 'photo',
    resolution: [800, 600],
    thumb:
      'imgproxy://rs:fill:100:100/g:sm/media/a32664ca-1ee5-11e8-b467-0ed5f89f718b',
    url: 'imgproxy://media/a32664ca-1ee5-11e8-b467-0ed5f89f718b',
    weight: 1,
    license: {
      name: 'Proprietary license',
      url: null,
      slug: null,
    },
  });
});

it('should return null image and thumb for blogs', async () => {
  const result = await testMedia({ id: BLOG_1 });
  expect(result.data?.media?.image).toBeNull();
  expect(result.data?.media?.thumb).toBeNull();
});

it('should return null image and thumb for videos', async () => {
  const result = await testMedia({ id: VIDEO_1 });
  expect(result.data?.media?.image).toBeNull();
  expect(result.data?.media?.thumb).toBeNull();
});

it('should return full image for photos', async () => {
  const result = await testMedia({ id: PHOTO_1 });
  expect(result.data?.media?.image).toBe(`imgproxy://media/${PHOTO_1}`);
});

it('should return thumb for photos', async () => {
  const result = await testMedia({ id: PHOTO_1 });
  expect(result.data?.media?.thumb).toBe(
    `imgproxy://rs:fill:100:100/g:sm/media/${PHOTO_1}`,
  );
});

it('should return null when id not specified', async () => {
  const result = await testMedia();
  expect(result.errors).toBeUndefined();
  expect(result.data?.media).toBeNull();
});

it('should full urls for photos', async () => {
  const result = await testMedia({ id: PHOTO_1 });
  expect(result.data?.media?.url).toBe(`imgproxy://media/${PHOTO_1}`);
});

it('should preserve external url for non-photos', async () => {
  const result = await testMedia({ id: BLOG_1 });
  expect(result.data?.media?.url).toBe('http://some.blog');
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await testMedia({ id: PHOTO_1 }, anonContext('ru'));
    expect(result).toHaveProperty('data.media.description', 'Фото 1 описание');
    expect(result).toHaveProperty('data.media.kind', 'photo');
  });

  it('should fall back to english when not translated', async () => {
    const result = await testMedia({ id: PHOTO_1 }, anonContext('pt'));
    expect(result).toHaveProperty(
      'data.media.description',
      'Photo 1 description',
    );
  });

  it('should fall back to default language when both desired and english translations are not provided', async () => {
    const result = await testMedia({ id: PASEKA_BLOG_1 }, anonContext('pt'));
    expect(result).toHaveProperty(
      'data.media.description',
      'Блог про Пасеку описание',
    );
  });
});
