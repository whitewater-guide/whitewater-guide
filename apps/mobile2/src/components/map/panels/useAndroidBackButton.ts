import { useMapSelection } from '@whitewater-guide/clients';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useAndroidBackButton() {
  const [selection, onSelected] = useMapSelection();

  useEffect(() => {
    const handler = () => {
      if (selection) {
        onSelected(null);
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => sub.remove();
  }, [selection, onSelected]);
}
