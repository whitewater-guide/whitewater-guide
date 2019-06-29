import { NavigationActions, StackActions } from 'react-navigation';
import Screens from '../../../screens/screen-names';

export const resetNavigationToHome = () =>
  StackActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName: Screens.RegionsList })],
  });
