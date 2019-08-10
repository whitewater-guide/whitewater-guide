import { useField } from 'formik';
import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { Omit } from 'type-zoo';
import { ErrorText } from './ErrorText';
import useFocus from './useFocus';
import useReactNativeHandlers from './useReactNativeHandlers';

type Props = {
  name: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

export const TextField = React.memo(
  forwardRef<TextInput, Props>(({ name, ...props }, ref) => {
    const inputRef = useFocus(ref);
    const [field, meta] = useField<string>(name);
    const { onChange, onBlur } = useReactNativeHandlers(field, props.onBlur);
    return (
      <React.Fragment>
        <TextInput
          {...props}
          ref={inputRef as any}
          value={field.value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={meta.touched && !!meta.error}
        />
        <ErrorText touched={meta.touched} error={meta.error} />
      </React.Fragment>
    );
  }),
);

TextField.displayName = 'TextField';
