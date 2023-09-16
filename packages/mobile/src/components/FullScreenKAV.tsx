import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, StyleSheet, View } from 'react-native';

import theme from '~/theme';

import KeyboardAvoidingView from './KeyboardAvoidingView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface Props {
  contentStyle?: StyleProp<ViewStyle>;
}
// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
const OFFSET = (Platform.OS === 'ios' ? 72 : 64) + theme.safeBottom;

const FullScreenKAV: FC<PropsWithChildren<Props>> = ({
  contentStyle,
  children,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    keyboardVerticalOffset={OFFSET}
  >
    <View style={[styles.container, contentStyle]}>{children}</View>
  </KeyboardAvoidingView>
);

export default FullScreenKAV;
