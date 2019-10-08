import React from 'react';
// tslint:disable-next-line:no-submodule-imports
import { NavigationStackOptions } from 'react-navigation-stack/lib/typescript/types';
import registerScreen from '../../../utils/registerScreen';

export const LazyBuyScreen = registerScreen<NavigationStackOptions>({
  require: () => require('./BuyScreen'),
  navigationOptions: {
    header: null,
  },
});
