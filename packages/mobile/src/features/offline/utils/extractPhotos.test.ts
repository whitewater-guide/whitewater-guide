import { Section } from '@whitewater-guide/schema';

import { extractPhotos } from './extractPhotos';

it('should extract photos', () => {
  const sections: Section[] = [
    {
      id: 's1',
      media: {
        count: 1,
        nodes: [
          {
            id: 'm1_1',
            kind: 'photo',
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
            kind: 'photo',
            image: '',
            thumb: '',
          },
          {
            id: 'm2_2',
            kind: 'photo',
            image: '',
            thumb: 'https://thumb2_2.com',
          },
          {
            id: 'm2_3',
            kind: 'video',
            image: 'https://image2_3.com',
            thumb: 'https://thumb2_3.com',
          },
        ],
      },
    },
  ] as any;
  expect(extractPhotos(sections)).toEqual([
    'https://image1_1.com',
    'https://thumb1_1.com',
    'https://thumb2_2.com',
  ]);
});
