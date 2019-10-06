import { getHeaderRenderer } from 'components/header';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import theme from '../../theme';
import {
  StackNavigatorConfig,
  WrappedStackNavigator,
} from '../../utils/navigation';
import Screens from '../screen-names';
import { LazyAlreadyHaveScreen } from './already-have';
import { LazyBuyScreen } from './buy';
import { LazySuccessScreen } from './success';
import { LazyVerifyScreen } from './verify';

const routes = {
  [Screens.Purchase.Buy]: {
    screen: LazyBuyScreen,
  },
  [Screens.Purchase.AlreadyHave]: {
    screen: LazyAlreadyHaveScreen,
  },
  [Screens.Purchase.Success]: {
    screen: LazySuccessScreen,
  },
  [Screens.Purchase.Verify]: {
    screen: LazyVerifyScreen,
  },
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.Purchase.Buy,
  headerMode: 'screen',
  defaultNavigationOptions: {
    headerBackTitle: null,
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: theme.colors.primaryBackground,
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTintColor: theme.colors.primary,
  },
  cardStyle: {
    backgroundColor: theme.colors.primaryBackground,
  },
} as any;

const Navigator = createStackNavigator(routes, config);

export const PurchaseStack: WrappedStackNavigator = React.memo((props) => {
  return <Navigator {...props} screenProps={props.navigation.state.params} />;
});

PurchaseStack.displayName = 'PurchaseStack';
PurchaseStack.router = Navigator.router;
PurchaseStack.navigationOptions = {
  header: null,
};
