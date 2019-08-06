import React from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import theme from '../theme';
import { ErrorBoundary } from './ErrorBoundary';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: theme.colors.primaryBackground,
  },
  padding: {
    padding: theme.margin.single,
  },
});

export interface ScreenProps {
  padding?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
  safe?: boolean;
}

export const Screen: React.FC<ScreenProps> = React.memo((props) => {
  const { padding, children, safe, onLayout } = props;
  const ContentComponent = safe ? SafeAreaView : View;
  return (
    <ErrorBoundary>
      <ContentComponent
        style={[styles.screen, padding && styles.padding]}
        onLayout={onLayout}
      >
        {children}
      </ContentComponent>
    </ErrorBoundary>
  );
});

Screen.displayName = 'Screen';
