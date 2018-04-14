import React from 'react';
import { StatusBar, StyleSheet, View, ViewProperties } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../theme';

const TOP_LEFT = { x: 0, y: 0 };

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primaryBackground,
  },
  padding: {
    padding: 8,
  },
});

interface ScreeProps extends ViewProperties {
  noScroll?: boolean;
  noPadding?: boolean;
  statusBar?: 'light' | 'dark';
}

export const Screen: React.StatelessComponent<ScreeProps> = ({ children, style, noScroll, noPadding, statusBar }) => {
  let screenStyles: any[] = [styles.screen];
  const barStyle = statusBar === 'light' ? 'light-content' : 'dark-content';

  if (!noPadding) {
    screenStyles = [...screenStyles, styles.padding];
  }
  screenStyles = [...screenStyles, style];
  if (noScroll) {
    return (
      <View style={[StyleSheet.absoluteFill, ...screenStyles]}>
        <StatusBar barStyle={barStyle} />
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
      <StatusBar barStyle={barStyle} />
      {children}
    </KeyboardAwareScrollView>
  );
};
