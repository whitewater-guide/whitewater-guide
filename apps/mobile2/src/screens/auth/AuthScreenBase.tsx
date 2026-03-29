import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

import Logo from '../../components/Logo';
import theme from '../../theme';

const styles = StyleSheet.create({
  body: {
    alignItems: 'stretch',
    padding: theme.margin.double,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryBackground,
    flex: 1,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 200,
  },
  scroll: {
    flex: 1,
  },
});

type AuthScreenBaseProps = PropsWithChildren<{
  testID?: string;
}>;

function AuthScreenBase({ children, testID }: AuthScreenBaseProps) {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={Platform.OS === 'android' ? 64 : 96}
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1 }}
        testID={testID}
      >
        <View style={styles.body}>
          <View style={styles.logoWrapper}>
            <Logo />
          </View>
          {children}
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

export default AuthScreenBase;
