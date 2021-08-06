import { createSafeValidator } from '@whitewater-guide/validation';

import { PurchaseInput } from '../__generated__/types';
import { PurchasePlatform } from './types';
import { PurchaseInputSchema } from './validation';

const validator = createSafeValidator(PurchaseInputSchema);

type TestValue = [string, PurchaseInput];
type IncorrectTestValue = [string, any];

const correct: PurchaseInput = {
  platform: PurchasePlatform.android,
  productId: 'region.altai',
  transactionId: '123',
  transactionDate: new Date(),
  receipt: '456',
  extra: { manual: true },
};

const correctValues: TestValue[] = [
  ['full value', correct],
  [
    'null value',
    {
      ...correct,
      transactionDate: null,
      receipt: null,
      extra: null,
    },
  ],
  [
    'only required fields',
    {
      platform: PurchasePlatform.android,
      productId: 'region.altai',
      transactionId: '123',
    },
  ],
];

const incorrectValues: IncorrectTestValue[] = [
  ['bad platform', { ...correct, platform: 'windows' }],
  ['bad product', { ...correct, productId: '' }],
  ['extra fields', { ...correct, foo: 'bb' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
