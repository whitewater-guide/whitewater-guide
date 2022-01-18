import React, {
  createContext,
  FC,
  RefObject,
  useContext,
  useMemo,
} from 'react';
import { runOnUI, SharedValue, useSharedValue } from 'react-native-reanimated';

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

export const SwipeableListProvider: FC<Props> = ({ children, listRef }) => {
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
