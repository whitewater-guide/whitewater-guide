import Coordinates from 'coordinate-parser';
import round from 'lodash/round';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Clipboard } from 'react-native';

export default (): CodegenCoordinates | null => {
  const [coordinate, setCoordinate] = useState<CodegenCoordinates | null>(null);
  const inspectClipboard = useCallback(() => {
    Clipboard.getString()
      .then((str) => {
        const coord = new Coordinates(str);
        const lat = round(coord.getLatitude(), 4);
        const lng = round(coord.getLongitude(), 4);
        setCoordinate([lng, lat, 0]);
      })
      .catch(() => {
        setCoordinate(null);
      });
  }, [setCoordinate]);
  useEffect(() => {
    AppState.addEventListener('change', inspectClipboard);
    return () => {
      AppState.removeEventListener('change', inspectClipboard);
    };
  }, [inspectClipboard]);
  useEffect(() => {
    inspectClipboard();
  }, [inspectClipboard]);
  return coordinate;
};
