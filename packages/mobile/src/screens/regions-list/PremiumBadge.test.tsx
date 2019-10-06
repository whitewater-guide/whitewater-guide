import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import PremiumBadge from './PremiumBadge';

it('should render placeholder for community regions', () => {
  const { getByTestId } = render(
    <PremiumBadge
      region={{ id: '__id__', hasPremiumAccess: false, premium: false }}
      canMakePayments={true}
      buyRegion={jest.fn()}
    />,
  );
  expect(getByTestId('nothing')).toBeTruthy();
});

it('should render placeholder when cannot make payments', () => {
  const { getByTestId } = render(
    <PremiumBadge
      region={{ id: '__id__', hasPremiumAccess: false, premium: true }}
      canMakePayments={false}
      buyRegion={jest.fn()}
    />,
  );
  expect(getByTestId('nothing')).toBeTruthy();
});

it('should render premium access indicator when user has access', () => {
  const { getByLabelText } = render(
    <PremiumBadge
      region={{ id: '__id__', hasPremiumAccess: true, premium: true }}
      canMakePayments={true}
      buyRegion={jest.fn()}
    />,
  );
  expect(getByLabelText('has premium access')).toBeTruthy();
});

it('should render buy button when user has no premium access', () => {
  const buyRegion = jest.fn();
  const { getByLabelText } = render(
    <PremiumBadge
      region={{ id: '__id__', hasPremiumAccess: false, premium: true }}
      canMakePayments={true}
      buyRegion={buyRegion}
    />,
  );
  const buyButton = getByLabelText('buy premium');
  fireEvent.press(buyButton);
  expect(buyRegion).toHaveBeenCalled();
});
