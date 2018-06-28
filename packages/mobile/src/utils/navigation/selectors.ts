import { NavigationRoute, NavigationState, NavigationStateRoute } from 'react-navigation';
import { shallowEqual } from 'recompose';

const hasLeafs = (route: NavigationRoute): route is NavigationStateRoute<any> => route.hasOwnProperty('index');

export const getNavigationDotPath = (state: NavigationRoute): string => {
  if (hasLeafs(state)) {
    const s = state as NavigationStateRoute<any>;
    // tslint:disable-next-line:prefer-template
    return s.routeName + '.' + getNavigationDotPath(s.routes[s.index]);
  }
  return state.routeName;
};

function isStateRoute(route: NavigationRoute<any>): route is NavigationStateRoute<any> {
  // tslint:disable-next-line
  return (<NavigationStateRoute<any>> route).routes !== undefined;
}

export const getCurrentRoute = (navigationState: NavigationState): NavigationRoute | null => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (isStateRoute(route)) {
    return getCurrentRoute(route);
  }
  return route;
};

const getCurrentRouteName = (navigationState: NavigationState): string | null => {
  const route = getCurrentRoute(navigationState);
  return route ? route.routeName : null;
};

export const dotRouteSelector = (state: NavigationState) => getNavigationDotPath(state as any);
export const currentRouteNameSelector = (state: NavigationState) => getCurrentRouteName(state);
export const isRouteFocused = (state: NavigationState, routeName: string, params?: any) => {
  const route = getCurrentRoute(state);
  if (params) {
    return route.routeName === routeName && shallowEqual(route.params, params);
  }
  return route.routeName === routeName;
};
