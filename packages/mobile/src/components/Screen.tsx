import React from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../theme';
import ErrorBoundary from './ErrorBoundary';

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
  style?: StyleProp<ViewStyle>;
}

export const Screen: React.FC<ScreenProps> = React.memo((props) => {
  const { padding, children, safe, onLayout, style } = props;
  const realStyle = style || [styles.screen, padding && styles.padding];
  const ContentComponent = safe ? SafeAreaView : View;
  return (
    <ErrorBoundary>
      <ContentComponent style={realStyle} onLayout={onLayout}>
        {children}
      </ContentComponent>
    </ErrorBoundary>
  );
});

Screen.displayName = 'Screen';
