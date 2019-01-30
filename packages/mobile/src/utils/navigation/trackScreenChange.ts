import Firebase from 'react-native-firebase';
import { NavigationState } from 'react-navigation';
import { currentRouteNameSelector, getCurrentRoute } from './selectors';

export const trackScreenChange = (
  prev: NavigationState,
  next: NavigationState,
) => {
  const currentScreen = getCurrentRoute(next);
  const prevScreenName = currentRouteNameSelector(prev);
  const currentScreenName = currentScreen ? currentScreen.routeName : null;
  if (
    currentScreenName &&
    prevScreenName !== currentScreenName &&
    currentScreen
  ) {
    Firebase.analytics().setCurrentScreen(currentScreenName);
    Firebase.analytics().logEvent(
      `Screen_${currentScreenName}`,
      currentScreen.params,
    );
  }
};
