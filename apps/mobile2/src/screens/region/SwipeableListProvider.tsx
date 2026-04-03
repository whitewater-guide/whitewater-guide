import type { ReanimatedSwipeable } from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';

interface SwipeableListContextValue {
  activeRef: React.RefObject<ReanimatedSwipeable | null>;
}

const SwipeableListContext = createContext<SwipeableListContextValue>(
  {} as SwipeableListContextValue,
);

export function SwipeableListProvider({ children }: PropsWithChildren) {
  const activeRef = useRef<ReanimatedSwipeable | null>(null);
  return (
    <SwipeableListContext.Provider value={{ activeRef }}>
      {children}
    </SwipeableListContext.Provider>
  );
}

export function useSwipeableList() {
  return useContext(SwipeableListContext);
}
