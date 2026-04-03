import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useRef } from 'react';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

interface SwipeableListContextValue {
  /** Ref to the currently open swipeable, if any */
  activeRef: React.MutableRefObject<SwipeableMethods | null>;
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
