import { StackActions } from 'react-navigation';

export const resetNavigationToHome = () => StackActions.reset({
  index: 0,
  key: null,
  actions: [
    StackActions.push({ routeName: 'RegionsList' }),
  ],
});
