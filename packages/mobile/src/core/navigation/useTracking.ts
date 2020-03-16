import { NavigationState, PartialState, Route } from '@react-navigation/native';
import React from 'react';
import { tracker } from '~/core/errors';

type MaybeRoute = Pick<Route<any>, 'name' | 'params'> | undefined;

const getActiveRoute = (
  state: NavigationState | PartialState<NavigationState> | undefined,
): MaybeRoute => {
  if (!state || !state.index) {
    return undefined;
  }
  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRoute(route.state);
  }

  return route;
};

export default (
  onStateChange: (state: NavigationState | undefined) => void,
) => {
  const routeRef = React.useRef<MaybeRoute>();
  return React.useCallback(
    (state: NavigationState | undefined) => {
      const previousRoute = routeRef.current;
      const currentRoute = getActiveRoute(state);

      if (currentRoute && previousRoute !== currentRoute) {
        tracker.setScreen(currentRoute.name, currentRoute.params);
      }
      routeRef.current = currentRoute;
      onStateChange(state);
    },
    [routeRef, onStateChange],
  );
};
