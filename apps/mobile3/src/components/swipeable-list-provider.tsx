import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
  type RefObject,
} from 'react';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

export interface SwipeableListContextValue {
  activeRef: RefObject<SwipeableMethods | null>;
}

const SwipeableListContext = createContext<SwipeableListContextValue | null>(
  null,
);

export function SwipeableListProvider({ children }: PropsWithChildren) {
  const activeRef = useRef<SwipeableMethods | null>(null);
  return (
    <SwipeableListContext.Provider value={{ activeRef }}>
      {children}
    </SwipeableListContext.Provider>
  );
}

export function useSwipeableList(): SwipeableListContextValue {
  const ctx = useContext(SwipeableListContext);
  if (!ctx) {
    throw new Error(
      'useSwipeableList must be used within SwipeableListProvider',
    );
  }
  return ctx;
}
