import Logo from 'components/Logo';
import { Screen } from 'components/Screen';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
  },
  body: {
    flex: 1,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
};
