import {
  createSafeValidator,
  Duration,
  MediaKind,
  TagCategory,
} from '@whitewater-guide/commons';
import { SectionFormData } from './types';
import { SectionFormSchema } from './validation';

const validator = createSafeValidator(SectionFormSchema);
type TestValue = [string, SectionFormData];

const correct: SectionFormData = {
  id: 'eda6bd7e-c34a-11e8-a355-529269fb1459',
  name: 'Section',
  altNames: ['Alt name 1', 'Alt name 2'],
  description: {
    markdown: 'markdown',
    prosemirror: { state: 'prosemirror' } as any,
    isMarkdown: true,
  },
  season: 'When it rains',
  seasonNumeric: [10, 11, 12],
  river: { id: '1aa9fd9a-c34b-11e8-a355-529269fb1459', name: 'river name' },
  gauge: { id: '2bedcd8e-c34b-11e8-a355-529269fb1459' },
  levels: { minimum: 10, optimum: null },
  flows: { maximum: 11, approximate: true },
  flowsText: 'unknown',
  shape: [[0, 0, 0], [0.1, 1, 0]],
  distance: 10,
  drop: 100,
  duration: Duration.LAPS,
  difficulty: 3.5,
  difficultyXtra: 'X',
  rating: 2.5,
  kayakingTags: [
    { id: '4x4', name: '4x4', category: TagCategory.kayaking },
    { id: 'portage', name: 'portage', category: TagCategory.kayaking },
  ],
  hazardsTags: [
    { id: '4x4', name: '4x4', category: TagCategory.hazards },
    { id: 'portage', name: 'portage', category: TagCategory.hazards },
  ],
  supplyTags: [
    { id: '4x4', name: '4x4', category: TagCategory.supply },
    { id: 'portage', name: 'portage', category: TagCategory.supply },
  ],
  miscTags: [
    { id: '4x4', name: '4x4', category: TagCategory.misc },
    { id: 'portage', name: 'portage', category: TagCategory.misc },
  ],
  pois: [
    {
      id: 'b5678064-c34b-11e8-a355-529269fb1459',
      coordinates: [1, 1.3, 200],
      description: 'poi description',
      name: 'some poi',
      kind: 'portage',
    },
  ],
  media: [
    {
      id: '4e108caa-fa39-11e9-8f0b-362b9e155667',
      kind: MediaKind.photo,
      url:
        'https://s3.whitewater.guide/media/d6aef4e0-f758-11e9-b404-63f7f453f7a2.png',
      weight: null,
      resolution: [100, 100],
      description: null,
      copyright: null,
    },
  ],
  hidden: false,
  helpNeeded: null,
};

const correctValues: TestValue[] = [
  ['full value', correct],
  [
    'null value',
    {
      ...correct,
      id: null,
      altNames: null,
      difficultyXtra: null,
      distance: null,
      drop: null,
      duration: null,
      flows: null,
      flowsText: null,
      gauge: null,
      levels: null,
      rating: null,
      season: null,
    },
  ],
  ['empty season', { ...correct, season: '' }],
  ['empty season numeric', { ...correct, seasonNumeric: [] }],
  ['empty flows text', { ...correct, flowsText: '' }],
  ['empty difficultyXtra', { ...correct, difficultyXtra: '' }],
];

const incorrectValues: TestValue[] = [
  ['bad id', { ...correct, id: 'foo' }],
  ['bad name', { ...correct, name: '' }],
  ['bad alt name', { ...correct, altNames: ['foo', '', 'bar'] }],
  [
    'bad season numeric (bad half-month)',
    { ...correct, seasonNumeric: [10, 100, -10, 11] },
  ],
  [
    'bad season numeric (too many items)',
    { ...correct, seasonNumeric: Array(30).fill(10) },
  ],
  ['bad river id', { ...correct, river: { id: 'foo' } }],
  ['bad gauge id', { ...correct, gauge: { id: 'foo' } }],
  ['bad shape (not enough points)', { ...correct, shape: [[1, 2, 3]] }],
  [
    'bad shape (bad point)',
    { ...correct, shape: [[1, 2, 3], [300, 1, 1], [2, 3, 4]] },
  ],
  ['bad distance', { ...correct, distance: -100 }],
  ['bad drop', { ...correct, drop: -100 }],
  ['bad duration', { ...correct, duration: -100 }],
  ['bad difficulty (min)', { ...correct, difficulty: -0.5 }],
  ['bad difficulty (max)', { ...correct, difficulty: 7.5 }],
  ['bad difficulty (fraction)', { ...correct, difficulty: 4.4 }],
  ['bad extra difficulty', { ...correct, difficultyXtra: 'x'.repeat(50) }],
  ['bad rating (min)', { ...correct, rating: -0.5 }],
  ['bad rating (max)', { ...correct, rating: 5.5 }],
  ['bad rating (fraction)', { ...correct, rating: 4.4 }],
  [
    'bad tag',
    {
      ...correct,
      kayakingTags: [
        { id: '4x4', name: '4x4', category: TagCategory.kayaking },
        { id: '4', name: '44x4', category: TagCategory.kayaking },
        { id: 'misc', name: 'misc', category: TagCategory.kayaking },
      ],
    },
  ],
  [
    'present tag field',
    {
      ...correct,
      tags: [{ id: '4x4' }],
    },
  ],
  [
    'bad pois',
    {
      ...correct,
      pois: [
        {
          id: null,
          description: null,
          kind: 'dam',
          name: null,
          coordinates: [1, 1, 1],
        },
        {
          id: 'foo',
          description: null,
          kind: 'dam',
          name: null,
          coordinates: [1, 1, 1],
        },
        {
          id: null,
          description: null,
          kind: 'dam',
          name: null,
          coordinates: [1, 2, 1],
        },
      ],
    },
  ],
  ['extra fields', { ...correct, foo: 'bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
