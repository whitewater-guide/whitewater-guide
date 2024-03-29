import type { FC, PropsWithChildren, RefObject } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { runOnUI, useSharedValue } from 'react-native-reanimated';

type SwipeableListContext = [
  selected: SharedValue<string> | undefined,
  close: () => void,
  listRef: RefObject<any>,
];

const SwipeableListCtx = createContext<SwipeableListContext>([
  undefined,
  () => {},
  null as any,
]);

interface Props {
  listRef: RefObject<any>;
}

export const SwipeableListProvider: FC<PropsWithChildren<Props>> = ({
  children,
  listRef,
}) => {
  const selected = useSharedValue('');

  const ctx = useMemo<SwipeableListContext>(() => {
    const close = () => {
      'worklet';
      selected.value = '';
    };
    return [
      selected,
      () => {
        runOnUI(close)();
      },
      listRef,
    ];
  }, [selected, listRef]);

  return (
    <SwipeableListCtx.Provider value={ctx}>
      {children}
    </SwipeableListCtx.Provider>
  );
};

export const useSwipeableList = () => useContext(SwipeableListCtx);
