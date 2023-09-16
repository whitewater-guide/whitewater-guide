import React from 'react';

import { Screen } from '~/components/Screen';

import BuyView from './BuyView';
import type { PurchaseBuyNavProps } from './types';
import usePurchaseState from './usePurchaseState';

const BuyScreen: React.FC<PurchaseBuyNavProps> = ({ route }) => {
  const { region, sectionId } = route.params;
  const state = usePurchaseState(region, sectionId);
  return (
    <Screen safeBottom>
      <BuyView region={region} purchaseState={state} />
    </Screen>
  );
};

export default BuyScreen;
