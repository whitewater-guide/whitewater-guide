import { fireEvent, render } from '@testing-library/react-native';
import React, { useCallback } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { getProducts, initConnection } from 'react-native-iap';

import { IapProvider, useIap } from './IAPProvider';
import useSkus from './useSkus';

jest.mock('./useSkus', () => jest.fn());

beforeEach(() => {
  jest.resetAllMocks();
  (useSkus as jest.Mock).mockReturnValue(
    new Map([
      ['Region.sku.1', false],
      ['Region.sku.2', false],
    ]),
  );
  (initConnection as jest.Mock).mockResolvedValue(true);
  (getProducts as jest.Mock).mockImplementation((skus: string[]) =>
    Promise.resolve(skus.map((productId) => ({ productId }))),
  );
});

const Consumer: React.FC = () => {
  const { products, loading, refresh, canMakePayments, error } = useIap();
  const onPress = useCallback(() => refresh(), [refresh]);
  if (loading) {
    return <ActivityIndicator accessibilityHint="loading" />;
  }
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  return (
    <View>
      <Text>{`Can make payments: ${canMakePayments}`}</Text>
      {error && <Text>{error.message}</Text>}
      {!error &&
        Array.from(products).map(([productId]) => (
          <Text key={productId}>{`Product: ${productId}`}</Text>
        ))}
      <Button title="Refresh" onPress={onPress} />
    </View>
  );
  /* eslint-enable @typescript-eslint/restrict-template-expressions */
};

const Test: React.FC = () => (
  <IapProvider>
    <Consumer />
  </IapProvider>
);

describe('can make payments', () => {
  it('should be true initially', () => {
    const { findByText } = render(<Test />);
    expect(findByText('Can make payments: true')).toBeTruthy();
  });

  it('should be false if iap says so', () => {
    (initConnection as jest.Mock).mockResolvedValue(false);
    const { findByText } = render(<Test />);
    expect(findByText('Can make payments: false')).toBeTruthy();
  });

  it('should still be true if initConnection fails', () => {
    (initConnection as jest.Mock).mockRejectedValue(new Error('foo'));
    const { findByText } = render(<Test />);
    expect(findByText('Can make payments: false')).toBeTruthy();
  });
});

describe('products', () => {
  it('should start in loading state', () => {
    const { getByHintText } = render(<Test />);
    expect(getByHintText('loading')).toBeTruthy();
  });

  it('should return products', async () => {
    const { findByText } = render(<Test />);
    await expect(findByText('Product: Region.sku.1')).resolves.toBeTruthy();
  });

  it('should return error if iap fails to get products', async () => {
    (getProducts as jest.Mock).mockRejectedValue(
      new Error('failed to get products'),
    );
    const { findByText, getByText } = render(<Test />);
    await expect(findByText(/errors\.fetchProduct/)).resolves.toBeTruthy();
    expect(() => getByText(/Product:/)).toThrow();
  });

  it('should update products when skus change', async () => {
    (useSkus as jest.Mock).mockReturnValue(new Map());
    const { findByText, getByHintText, getByText } = render(<Test />);
    expect(() => getByHintText('loading')).toThrow();
    expect(() => getByText(/Product/)).toThrow();
    (useSkus as jest.Mock).mockReturnValue(
      new Map([
        ['Region.sku.1', false],
        ['Region.sku.2', false],
      ]),
    );
    await expect(findByText('Product: Region.sku.1')).resolves.toBeTruthy();
  });

  it('should manually refresh', async () => {
    (getProducts as jest.Mock).mockReturnValue([{ productId: 'Region.sku.1' }]);
    const { findByText } = render(<Test />);
    (getProducts as jest.Mock).mockReturnValue([
      { productId: 'Region.sku.1' },
      { productId: 'Region.sku.2' },
    ]);
    const refreshBtn = await findByText('Refresh');
    fireEvent.press(refreshBtn);
    await expect(findByText('Product: Region.sku.2')).resolves.toBeTruthy();
  });

  it('should provide error if manual refresh fails', async () => {
    const { findByText, getByText } = render(<Test />);
    (getProducts as jest.Mock).mockRejectedValue(
      new Error('failed to get products'),
    );
    const refreshBtn = await findByText('Refresh');
    fireEvent.press(refreshBtn);
    await expect(findByText(/errors\.fetchProduct/)).resolves.toBeTruthy();
    expect(() => getByText('Product: Region.sku.1')).toThrow();
  });
});
