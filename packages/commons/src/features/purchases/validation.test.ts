import { createSafeValidator } from '../../validation';
import { PurchaseInput, PurchasePlatform } from './types';
import { PurchaseInputSchema } from './validation';

const validator = createSafeValidator(PurchaseInputSchema);

type TestValue = [string, PurchaseInput];

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
    'empty value',
    {
      platform: PurchasePlatform.android,
      productId: 'region.altai',
      transactionId: '123',
    },
  ],
];

const incorrectValues: TestValue[] = [
  ['bad platform', { ...correct, platform: 'windows' } as any],
  ['bad product', { ...correct, productId: '' }],
  ['extra fields', { ...correct, foo: 'bb' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
