import { useField } from 'formik';
import { forwardRef, memo, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import type { TextInput } from 'react-native-paper';

import HelperText from '../HelperText';
import useReactNativeHandlers from '../useReactNativeHandlers';
import type { PasswordInputProps } from './PasswordInput';
import { PasswordInput } from './PasswordInput';

type TextInputProps = React.ComponentProps<typeof TextInput>;

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});

type Props = {
  name: string;
} & PasswordInputProps &
  Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange' | 'onBlur'>;

const PasswordField = memo(
  forwardRef<any, Props>(({ name, ...props }, ref) => {
    const [field, meta] = useField<string>(name);
    const { onChange, onBlur } = useReactNativeHandlers(field);
    const [wasFocused, setWasFocused] = useState(false);
    const onFocus = useCallback(() => setWasFocused(true), []);
    const strengthIndicatorStyle = wasFocused ? undefined : styles.hidden;
    return (
      <>
        <PasswordInput
          {...props}
          ref={ref}
          strengthIndicatorStyle={strengthIndicatorStyle}
          value={field.value}
          onChangeText={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          error={meta.touched && !!meta.error}
        />
        {!props.showStrengthIndicator && (
          <HelperText touched={meta.touched} error={meta.error} />
        )}
      </>
    );
  }),
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
