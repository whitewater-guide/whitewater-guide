import { NavigationActions } from 'react-navigation';

export const resetNavigationToHome = () => NavigationActions.reset({
  index: 1,
  key: null,
  actions: [
    NavigationActions.navigate({ routeName: 'MainStack' }),
    NavigationActions.navigate({ routeName: 'Main' }),
  ],
});
