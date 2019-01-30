import { createValidator } from '../../utils/validation';
import { UserInput } from './types';
import { UserInputStruct } from './validation';

const validator = createValidator(UserInputStruct);

type TestValue = [string, UserInput];

const correctValues: TestValue[] = [
  [
    'full value',
    { name: 'foo', avatar: 'bar', imperial: true, language: 'en' },
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
];

const incorrectValues: TestValue[] = [
  ['empty name', { name: '' }],
  ['bad language', { language: 'xx' }],
  ['extra fields', { language: 'en', foo: 'bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});
