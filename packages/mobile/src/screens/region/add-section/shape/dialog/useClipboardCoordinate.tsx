import Coordinates from 'coordinate-parser';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Clipboard } from 'react-native';
import { Uncoordinate } from '../../types';

export default (): Uncoordinate | null => {
  const [coordinate, setCoordinate] = useState<Uncoordinate | null>(null);
  const inspectClipboard = useCallback(
    () =>
      Clipboard.getString()
        .then((str) => {
          const coord = new Coordinates(str);
          const lat = coord.getLatitude();
          const lng = coord.getLongitude();
          setCoordinate([lng.toFixed(4), lat.toFixed(4), undefined]);
        })
        .catch(() => {
          setCoordinate(null);
        }),
    [setCoordinate],
  );
  useEffect(() => {
    AppState.addEventListener('change', inspectClipboard);
    return () => {
      AppState.removeEventListener('change', inspectClipboard);
    };
  }, [inspectClipboard]);
  return coordinate;
};
