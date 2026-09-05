import { Formik } from 'formik';
import type { ReactNode } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Spacing } from '@/constants/theme';

export interface FormikDecoratorProps<T extends object> {
  initialValues: T;
  children?: ReactNode;
}

function noopSubmit(): void {}

function dismissKeyboard(): void {
  Keyboard.dismiss();
}

export function FormikDecorator<T extends object>({
  initialValues,
  children,
}: FormikDecoratorProps<T>) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Formik initialValues={initialValues} onSubmit={noopSubmit}>
        {() => (
          <TouchableWithoutFeedback
            accessible={false}
            onPress={dismissKeyboard}
          >
            <View style={styles.padding}>{children}</View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  padding: {
    flex: 1,
    padding: Spacing.three,
  },
});
