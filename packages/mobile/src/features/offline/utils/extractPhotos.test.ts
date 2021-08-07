import { MediaKind } from '@whitewater-guide/schema';
import { DeepPartial, ValuesType } from 'utility-types';

import { ListSectionsQuery } from '~/features/offline/offlineSections.generated';

import { extractPhotos } from './extractPhotos';

type ListedSection = ValuesType<ListSectionsQuery['sections']['nodes']>;

it('should extract photos', () => {
  const sections: Array<DeepPartial<ListedSection>> = [
    {
      id: 's1',
      media: {
        count: 1,
        nodes: [
          {
            id: 'm1_1',
            kind: MediaKind.Photo,
            image: 'https://image1_1.com',
            thumb: 'https://thumb1_1.com',
          },
        ],
      },
    },
    {
      id: 's2',
      media: {
        count: 3,
        nodes: [
          {
            id: 'm2_1',
            kind: MediaKind.Photo,
            image: '',
            thumb: '',
          },
          {
            id: 'm2_2',
            kind: MediaKind.Photo,
            image: '',
            thumb: 'https://thumb2_2.com',
          },
          {
            id: 'm2_3',
            kind: MediaKind.Video,
            image: 'https://image2_3.com',
            thumb: 'https://thumb2_3.com',
          },
        ],
      },
    },
  ];
  expect(extractPhotos(sections)).toEqual([
    'https://image1_1.com',
    'https://thumb1_1.com',
    'https://thumb2_2.com',
  ]);
});
