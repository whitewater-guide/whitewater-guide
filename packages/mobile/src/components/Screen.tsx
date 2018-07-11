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
});

interface ScreenProps extends ViewProps {
  noScroll?: boolean;
  noPadding?: boolean;
}

export const Screen: React.StatelessComponent<ScreenProps> = ({ children, style, noScroll, noPadding }) => {
  let screenStyles: any[] = [styles.screen];

  if (!noPadding) {
    screenStyles = [...screenStyles, styles.padding];
  }
  screenStyles = [...screenStyles, style];
  if (noScroll) {
    return (
      <View style={[StyleSheet.absoluteFill, ...screenStyles]}>
        {children}
      </View>
    );
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
