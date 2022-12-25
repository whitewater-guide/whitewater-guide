import React, { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import useToggle from 'react-use/lib/useToggle';

const styles = StyleSheet.create({
  view: {
    overflow: 'hidden',
  },
});

interface Props {
  collapsed: boolean;
  collapsedHeight: number;
}

export const Collapsible: FC<PropsWithChildren<Props>> = ({
  children,
  collapsed,
  collapsedHeight,
}) => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [collapsed]);

  return (
    <View
      style={[styles.view, { height: collapsed ? collapsedHeight : undefined }]}
    >
      {children}
    </View>
  );
};

export function useCollapsible(
  initialCollapsed: boolean,
): [boolean, () => void] {
  const [collapsed, tCollapsed] = useToggle(initialCollapsed);
  const toggleCollapsed = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    tCollapsed();
  }, [tCollapsed]);

  return [collapsed, toggleCollapsed];
}
