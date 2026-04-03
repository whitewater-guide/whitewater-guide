import type { PropsWithChildren } from 'react';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  view: {
    overflow: 'hidden',
  },
});

interface Props {
  collapsed: boolean;
  collapsedHeight: number;
}

export function Collapsible({
  children,
  collapsed,
  collapsedHeight,
}: PropsWithChildren<Props>) {
  const height = useSharedValue(collapsed ? collapsedHeight : -1);

  const animatedStyle = useAnimatedStyle(() => {
    if (height.value === -1) {
      // unconstrained — let content size naturally
      return {};
    }
    return { height: height.value };
  });

  // Animate height whenever collapsed prop changes
  React.useEffect(() => {
    if (collapsed) {
      height.value = withTiming(collapsedHeight);
    } else {
      height.value = withTiming(1000); // large enough; content clips naturally
    }
  }, [collapsed, collapsedHeight, height]);

  return (
    <Animated.View style={[styles.view, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export function useCollapsible(
  initialCollapsed: boolean,
): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);
  return [collapsed, toggleCollapsed];
}
