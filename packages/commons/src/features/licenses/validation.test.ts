import { createSafeValidator } from '@whitewater-guide/validation';

import { License } from './types';
import { LicenseInputSchema } from './validation';

const validator = createSafeValidator(LicenseInputSchema);
type TestValue = [string, License];

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

const incorrectValues: TestValue[] = [
  ['bad name', { name: 'x' }],
  ['bad slug', { name: 'MIT', slug: 'X Y' }],
  ['bad url', { name: 'MIT', url: 'whatever' }],
  // @ts-expect-error: extra fields
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
