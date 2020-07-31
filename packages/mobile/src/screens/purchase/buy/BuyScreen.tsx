import React from 'react';
import { Screen } from '~/components/Screen';
import BuyView from './BuyView';
import { PurchaseBuyNavProps } from './types';
import usePurchaseState from './usePurchaseState';

const BuyScreen: React.FC<PurchaseBuyNavProps> = ({ route }) => {
  const { region, sectionId } = route.params;
  const state = usePurchaseState(region, sectionId);
  return (
    <Screen safeBottom={true}>
      <BuyView region={region} purchaseState={state} />
    </Screen>
  );
};

export default BuyScreen;
