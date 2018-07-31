import { createValidator } from '../../utils/validation';
import { GroupInput } from './types';
import { GroupInputStruct } from './validation';

const validator = createValidator(GroupInputStruct);

type TestValue = [string, GroupInput];

const correctValue: GroupInput = {
  id: 'dedf9d28-c251-11e8-a355-529269fb1459',
  name: 'Some group',
  sku: 'group.all',
};

const correct: TestValue[] = [
  [
    'full value',
    correctValue,
  ],
  [
    'null value',
    { id: null, sku: null, name: 'Group' },
  ],
  [
    'fancy sku value',
    { ...correctValue, sku: 'group.sKu11_1' },
  ],
];

const incorrect: TestValue[] = [
  [
    'bad uuid',
    { ...correctValue, id: 'foo' },
  ],
  [
    'empty name',
    { ...correctValue, name: '' },
  ],
  [
    'bad sku value - random',
    { ...correctValue, sku: 'aaaa' },
  ],
  [
    'bad sku value - prefix',
    { ...correctValue, sku: 'region.sku' },
  ],
  [
    'bad sku value - postfix',
    { ...correctValue, sku: 'group.a' },
  ],
  [
    'bad sku value - non-word',
    { ...correctValue, sku: 'group.foo-bar' },
  ],
  [
    'bad sku value - cyrillic',
    { ...correctValue, sku: 'group.группа' },
  ],
  [
    'bad sku value - multiline',
    { ...correctValue, sku: '\ngroup.all' },
  ],
  [
    'bad sku value - multimatch',
    { ...correctValue, sku: 'group.all\ngroup.some' },
  ],
];

it.each(correct)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrect)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});