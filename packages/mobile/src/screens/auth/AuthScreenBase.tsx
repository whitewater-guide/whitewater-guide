import Logo from 'components/Logo';
import { Screen } from 'components/Screen';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
  },
  body: {
    height: theme.stackScreenHeight,
    alignItems: 'stretch',
    padding: theme.margin.double,
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 200,
  },
});

export const AuthScreenBase: React.FC = ({ children }) => {
  return (
    <Screen safe={true}>
      <KeyboardAwareScrollView>
        <View style={styles.body}>
          <View style={styles.logoWrapper}>
            <Logo />
          </View>
          {children}
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};
