import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import theme from '../theme';
import ErrorBoundary from './ErrorBoundary';
import { setSoftInputMode, SoftInputMode } from './SoftInput';

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
  softInputMode?: SoftInputMode;
}

const NO_TOP_EDGE: any = { edges: ['left', 'right', 'bottom'] };
const NO_BOTTOM_EDGE: any = { edges: ['left', 'right', 'top'] };

export const Screen: React.FC<ScreenProps> = React.memo((props) => {
  const {
    padding,
    children,
    safeBottom = false,
    safeTop = false,
    onLayout,
    style,
    softInputMode = SoftInputMode.ADJUST_PAN,
  } = props;
  const realStyle = style || [styles.screen, padding && styles.padding];
  const ContentComponent = safeBottom || safeTop ? SafeAreaView : View;

  let safeProps: any;
  if (safeBottom && !safeTop) {
    safeProps = NO_TOP_EDGE;
  } else if (!safeBottom && safeTop) {
    safeProps = NO_BOTTOM_EDGE;
  }

  useFocusEffect(
    useCallback(() => {
      setSoftInputMode(softInputMode);
    }, [softInputMode]),
  );

  return (
    <ErrorBoundary>
      <ContentComponent style={realStyle} onLayout={onLayout} {...safeProps}>
        {children}
      </ContentComponent>
    </ErrorBoundary>
  );
});

Screen.displayName = 'Screen';
