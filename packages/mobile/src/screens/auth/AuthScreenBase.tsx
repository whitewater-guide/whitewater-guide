import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Logo } from '../../components';
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
  logo: {
    maxWidth: '80%',
    flex: 1,
  },
});

export const AuthScreenBase: React.FC = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <SafeAreaView style={styles.root}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <View style={styles.logoWrapper}>
              <Logo style={styles.logo} />
            </View>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
