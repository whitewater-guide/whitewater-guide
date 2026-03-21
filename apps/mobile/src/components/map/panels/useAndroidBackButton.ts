import { useBackHandler } from '@react-native-community/hooks';
import { useMapSelection } from '@whitewater-guide/clients';

export default function useAndroidBackButton() {
  const [selection, onSelected] = useMapSelection();

  useBackHandler(() => {
    if (selection) {
      onSelected(null);
      return true;
    }
    return false;
  });
}
