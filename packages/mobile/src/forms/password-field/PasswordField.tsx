import { useField } from 'formik';
import React, { forwardRef, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from '../HelperText';
import useFocus from '../useFocus';
import useReactNativeHandlers from '../useReactNativeHandlers';
import { PasswordInput, PasswordInputProps } from './PasswordInput';

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

export const PasswordField = React.memo(
  forwardRef<any, Props>(({ name, ...props }, ref) => {
    const inputRef = useFocus(ref);
    const [field, meta] = useField<string>(name);
    const { onChange, onBlur } = useReactNativeHandlers(field);
    const [wasFocused, setWasFocused] = useState(false);
    const onFocus = useCallback(() => setWasFocused(true), [setWasFocused]);
    const strengthIndicatorStyle = wasFocused ? undefined : styles.hidden;
    return (
      <>
        <PasswordInput
          {...props}
          ref={inputRef as any}
          strengthIndicatorStyle={strengthIndicatorStyle}
          value={field.value}
          onChangeText={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        {!props.showStrengthIndicator && (
          <HelperText touched={meta.touched} error={meta.error} />
        )}
      </>
    );
  }),
);

PasswordField.displayName = 'PasswordField';
