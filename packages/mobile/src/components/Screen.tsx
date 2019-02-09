import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../theme';

const TOP_LEFT = { x: 0, y: 0 };

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primaryBackground,
  },
  padding: {
    padding: theme.margin.single,
  },
  noScroll: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export interface ScreenProps extends ViewProps {
  noScroll?: boolean;
  noPadding?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  noScroll,
  noPadding,
}) => {
  let screenStyles: any[] = [styles.screen];

  if (!noPadding) {
    screenStyles = [...screenStyles, styles.padding];
  }
  screenStyles = [...screenStyles, style];
  if (noScroll) {
    return <View style={[styles.noScroll, ...screenStyles]}>{children}</View>;
  }
  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={screenStyles}
      automaticallyAdjustContentInsets={false}
      resetScrollToCoords={TOP_LEFT}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};
