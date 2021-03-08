import { useCallback, useState } from 'react';
import { LayoutChangeEvent, Platform, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

type UseLayoutHeight = [number | undefined, (e: LayoutChangeEvent) => void];

export const useLayoutHeight = (subtractStatusBar = true): UseLayoutHeight => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  }, []);

  const statusBar =
    Platform.OS === 'ios'
      ? getStatusBarHeight(false)
      : StatusBar.currentHeight || 0;
  let useHeight = height;
  if (subtractStatusBar && useHeight !== undefined) {
    useHeight -= statusBar;
  }

  return [useHeight, onLayout];
};
