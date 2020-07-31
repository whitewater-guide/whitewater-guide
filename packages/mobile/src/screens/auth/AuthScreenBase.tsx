import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from '~/components/Logo';
import { Screen } from '~/components/Screen';
import theme from '~/theme';

const styles = StyleSheet.create({
  body: {
    height: theme.stackScreenHeight,
    alignItems: 'stretch',
    padding: theme.margin.double,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryBackground,
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
    <Screen safeBottom={true}>
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
