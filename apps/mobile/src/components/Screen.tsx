import type { PropsWithChildren } from 'react';
import React, { memo } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import theme from '../theme';
import ErrorBoundary from './ErrorBoundary';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  padding: {
    padding: theme.margin.single,
  },
});

export interface ScreenProps {
  padding?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
  safeBottom?: boolean;
  safeTop?: boolean;
}

const NO_TOP_EDGE: any = { edges: ['left', 'right', 'bottom'] };
const NO_BOTTOM_EDGE: any = { edges: ['left', 'right', 'top'] };

export const Screen = memo((props: PropsWithChildren<ScreenProps>) => {
  const {
    padding,
    children,
    safeBottom = false,
    safeTop = false,
    onLayout,
    style,
  } = props;
  const realStyle = style || [styles.screen, padding && styles.padding];
  const ContentComponent = safeBottom || safeTop ? SafeAreaView : View;

  let safeProps: any;
  if (safeBottom && !safeTop) {
    safeProps = NO_TOP_EDGE;
  } else if (!safeBottom && safeTop) {
    safeProps = NO_BOTTOM_EDGE;
  }

  return (
    <ErrorBoundary>
      <ContentComponent style={realStyle} onLayout={onLayout} {...safeProps}>
        {children}
      </ContentComponent>
    </ErrorBoundary>
  );
});

Screen.displayName = 'Screen';
