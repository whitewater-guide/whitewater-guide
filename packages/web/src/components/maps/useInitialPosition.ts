/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { arrayToGmaps } from '@whitewater-guide/clients';
import noop from 'lodash/noop';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { InitialPosition } from './GoogleMap';

interface UseInitialPositionHook {
  initialPosition: InitialPosition;
  onBoundsChanged: (bounds: google.maps.LatLngBounds) => void;
}

function useSavedPosition(
  defaultPosition: InitialPosition,
  key: string,
): InitialPosition {
  return useMemo(() => {
    const val = sessionStorage.getItem(key);
    if (val) {
      return JSON.parse(val);
    }
    return defaultPosition;
  }, [defaultPosition, key]);
}

/**
 * This hook is used to memoize positions of maps in session storage.
 * So if we go from region map to section and back, then region maps stays in the same bounds.
 *
 * This hook breaks the rules of hooks, but it's deliberate
 *
 * @param initialBounds Map bounds to use if there's nothing in session storage
 * @param key Session storage key for particular map. Put something like region id here.
 *        When not set, will always start in initialBounds
 * @returns
 */
export default function useInitialPosition(
  initialBounds: CodegenCoordinates[],
  storageKey?: string,
): UseInitialPositionHook {
  // Convert bounds to google map position
  const initialPosition: InitialPosition = useMemo(() => {
    const bounds = new google.maps.LatLngBounds();
    initialBounds.forEach((point: CodegenCoordinates) =>
      bounds.extend(arrayToGmaps(point)),
    );
    return {
      center: bounds.getCenter(),
      bounds,
      zoom: -1,
    };
  }, [initialBounds]);

  // Treat key as immutable
  // So we can conditionally call hooks and nothing would break
  const key = useRef(storageKey).current;
  if (key) {
    const boundsRef = useRef<google.maps.LatLngBounds | null>(null);
    // Load what's in session storage
    const savedPosition = useSavedPosition(initialPosition, `ww_ip_${key}`);

    // keep track of map position
    const onBoundsChanged = useCallback(
      (bounds: google.maps.LatLngBounds) => {
        boundsRef.current = bounds;
      },
      [boundsRef],
    );

    // On unmount, save new position
    useEffect(() => {
      return () => {
        if (boundsRef.current) {
          const newPos: InitialPosition = { bounds: boundsRef.current };
          sessionStorage.setItem(`ww_ip_${key}`, JSON.stringify(newPos));
        }
      };
    }, []);

    return { initialPosition: savedPosition, onBoundsChanged };
  }

  return { initialPosition, onBoundsChanged: noop };
}
