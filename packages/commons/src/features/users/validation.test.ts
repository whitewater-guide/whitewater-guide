import { UserInput } from './types';
import { UserInputSchema } from './validation';
import { createSafeValidator } from '@whitewater-guide/validation';

const validator = createSafeValidator(UserInputSchema);

type TestValue = [string, UserInput];

const correctValues: TestValue[] = [
  [
    'full value',
    {
      name: 'foo',
      avatar: 'bar',
      imperial: true,
      language: 'en',
      email: 'foo@bar.com',
    },
  ],
  ['empty avatar', { name: 'foo', avatar: '', imperial: true, language: 'en' }],
  [
    'null avatar',
    { name: 'foo', avatar: null, imperial: true, language: 'en' },
  ],
  ['no name', { avatar: 'bar', imperial: true, language: 'en' }],
  ['no avatar', { name: 'foo', imperial: true, language: 'en' }],
  ['no imperial', { name: 'foo', avatar: 'bar', language: 'en' }],
  ['no language', { name: 'foo', avatar: 'bar', imperial: true }],
  ['no email', { name: 'foo', avatar: 'bar', imperial: true, language: 'en' }],
  [
    'null email',
    { name: 'foo', avatar: 'bar', imperial: true, language: 'en', email: null },
  ],
];

const incorrectValues: TestValue[] = [
  ['empty name', { name: '' }],
  ['bad language', { language: 'xx' }],
  ['bad email', { language: 'en', email: 'bar' }],
  ['extra fields', { language: 'en', foo: 'bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
