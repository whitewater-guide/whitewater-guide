import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface Props {
  contentStyle?: StyleProp<ViewStyle>;
}

const OFFSET =
  (Platform.OS === 'ios' ? 32 : 64) + theme.safeBottom + theme.safeTop;

const FullScreenKAV: React.FC<Props> = ({ contentStyle, children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={OFFSET}
    >
      <View style={[styles.container, contentStyle]}>{children}</View>
    </KeyboardAvoidingView>
  );
};

export default FullScreenKAV;
