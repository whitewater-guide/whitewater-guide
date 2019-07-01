import { MutableRefObject, useCallback, useRef } from 'react';
import ActionSheet from 'react-native-actionsheet';

type UseActionSheetHook = [MutableRefObject<ActionSheet | null>, () => void];

export const useActionSheet = (): UseActionSheetHook => {
  const actionSheet = useRef<ActionSheet | null>(null);
  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, [actionSheet]);
  return [actionSheet, showMenu];
};
