import { createSafeValidator } from '@whitewater-guide/validation';

import type { LicenseInput } from '../__generated__/types';
import { LicenseInputSchema } from './validation';

const validator = createSafeValidator(LicenseInputSchema);
type TestValue = [string, LicenseInput];
type IncorrectTestValue = [string, any];

const correctValues: TestValue[] = [
  [
    'full value',
    {
      name: 'MIT',
      slug: 'MIT',
      url: 'https://github.com/whitewater-guide/gorge/blob/master/LICENSE',
    },
  ],
  [
    'null value',
    {
      name: 'MIT',
      slug: null,
      url: null,
    },
  ],
  ['empty value', { name: 'MIT' }],
];

const incorrectValues: IncorrectTestValue[] = [
  ['bad name', { name: 'x' }],
  ['bad slug', { name: 'MIT', slug: 'X Y' }],
  ['bad url', { name: 'MIT', url: 'whatever' }],
  ['extra fields', { name: 'MIT', foo: 'bar' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
