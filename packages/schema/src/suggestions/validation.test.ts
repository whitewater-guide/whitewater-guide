import { createSafeValidator } from '@whitewater-guide/validation';

import type { SuggestionInput } from '../__generated__/types';
import {
  PhotoSuggestionInputSchema,
  SuggestionInputSchema,
} from './validation';

type TestValue = [string, SuggestionInput];
type IncorrectTestValue = [string, any];

describe('SuggestionInputSchema', () => {
  const validator = createSafeValidator(SuggestionInputSchema);

  const required: SuggestionInput = {
    section: { id: '45bcd1fc-b5de-11e9-a2a3-2a2ae2dbcce4' },
    description: 'descr',
  };

  const correct: SuggestionInput = {
    ...required,
    copyright: 'copyright',
    filename: null,
    resolution: null,
  };

  const correctValues: TestValue[] = [
    ['without media', correct],
    ['required fields only', required],
    [
      'with media',
      {
        ...correct,
        filename: 'fooo.jpg',
        resolution: [100, 100],
      },
    ],
  ];

  const incorrectValues: IncorrectTestValue[] = [
    ['all empty', { ...correct, description: null, copyright: null }],
    ['bad uuid', { ...correct, section: { id: 'fooo' } }],
    [
      'just media',
      {
        ...correct,
        description: null,
        copyright: null,
        filename: 'fooo.jpg',
        resolution: [100, 100],
      },
    ],
    ['no description and no media', { ...correct, description: null }],
    ['filename without resolution', { ...correct, filename: 'foo.jpg' }],
    ['resolution without filename', { ...correct, resolution: [100, 100] }],
    [
      'bad resolution',
      { ...correct, filename: 'foo.jpg', resolution: [100, 100, 100] },
    ],
    ['extra fields', { ...correct, foo: 'bar' }],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});

describe('PhotoSuggestionInputSchema', () => {
  const validator = createSafeValidator(PhotoSuggestionInputSchema);

  const required: SuggestionInput = {
    section: { id: '45bcd1fc-b5de-11e9-a2a3-2a2ae2dbcce4' },
    filename: 'fooo.jpg',
    resolution: [100, 100],
  };

  const correct: SuggestionInput = {
    ...required,
    description: 'descr',
    copyright: 'copyright',
  };

  const correctValues: TestValue[] = [
    ['full', correct],
    ['required fields only', required],
    [
      'without description',
      {
        ...correct,
        description: null,
        copyright: null,
      },
    ],
  ];

  const incorrectValues: IncorrectTestValue[] = [
    [
      'all empty',
      {
        ...correct,
        filename: null,
        description: null,
        resolution: null,
        copyright: null,
      },
    ],
    ['no filename', { ...correct, filename: null }],
    ['no resolution', { ...correct, resolution: null }],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});
