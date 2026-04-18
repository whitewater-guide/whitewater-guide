import { Formik } from 'formik';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

interface Props<T extends Record<string, unknown>> {
  initialValues: T;
}

export function FormikDecorator<T extends Record<string, unknown>>({
  initialValues,
  children,
}: PropsWithChildren<Props<T>>) {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {() => <View style={{ padding: 16 }}>{children}</View>}
    </Formik>
  );
}
