import type {
  NavigationContainerRefWithCurrent,
  NavigationState,
} from '@react-navigation/native';
import { useMemo, useRef } from 'react';

import { tracker } from '~/core/errors';

export default function useTracking(
  navigationRef: NavigationContainerRefWithCurrent<any>,
  onStateChange?: (state?: NavigationState) => void,
) {
  const routeNameRef = useRef('/');

  return useMemo(() => {
    const trackStateChange = () => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef?.getCurrentRoute()?.name ?? '/';
      const currentRouteParams = navigationRef?.getCurrentRoute()?.params;

      if (previousRouteName !== currentRouteName) {
        tracker.trackScreen(
          previousRouteName,
          currentRouteName,
          currentRouteParams,
        );
      }

      routeNameRef.current = currentRouteName;
    };

    return {
      onReady: () => {
        trackStateChange();
      },
      onStateChange: (state?: NavigationState) => {
        trackStateChange();
        onStateChange?.(state);
      },
    };
  }, [navigationRef, routeNameRef, onStateChange]);
}
