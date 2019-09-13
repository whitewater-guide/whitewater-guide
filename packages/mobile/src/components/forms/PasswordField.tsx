import { useField } from 'formik';
import React, { forwardRef, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { Omit } from 'type-zoo';
import { PasswordInput, PasswordInputProps } from '../PasswordInput';
import { HelperText } from './HelperText';
import useFocus from './useFocus';
import useReactNativeHandlers from './useReactNativeHandlers';

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
  forwardRef<TextInput, Props>(({ name, ...props }, ref) => {
    const inputRef = useFocus(ref);
    const [field, meta] = useField<string>(name);
    const { onChange, onBlur } = useReactNativeHandlers(field);
    const [wasFocused, setWasFocused] = useState(false);
    const onFocus = useCallback(() => setWasFocused(true), [setWasFocused]);
    const strengthIndicatorStyle = wasFocused ? undefined : styles.hidden;
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }),
);

PasswordField.displayName = 'PasswordField';
