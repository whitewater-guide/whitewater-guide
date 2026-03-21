import Clipboard from '@react-native-clipboard/clipboard';
import Coordinates from 'coordinate-parser';
import round from 'lodash/round';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

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
    const sub = AppState.addEventListener('change', inspectClipboard);
    return () => {
      sub.remove();
    };
  }, [inspectClipboard]);
  useEffect(() => {
    inspectClipboard();
  }, [inspectClipboard]);
  return coordinate;
};
