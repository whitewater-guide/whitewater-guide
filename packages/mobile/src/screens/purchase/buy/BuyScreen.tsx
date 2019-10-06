import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { NavParams } from '../types';
import BuyView from './BuyView';
import usePurchaseState from './usePurchaseState';

const BuyScreen: NavigationScreenComponent = ({ screenProps }) => {
  const { region, sectionId } = screenProps as NavParams;
  const state = usePurchaseState(region, sectionId);
  return (
    <Screen safe={true}>
      <BuyView region={region} purchaseState={state} />
    </Screen>
  );
};

export default BuyScreen;
