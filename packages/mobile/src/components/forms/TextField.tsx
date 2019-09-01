import { useField } from 'formik';
import React, { forwardRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { HelperText } from './HelperText';
import useFocus from './useFocus';
import useReactNativeHandlers from './useReactNativeHandlers';

type Props = {
  name: string;
  helperText?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  displayError?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

export const TextField = React.memo(
  forwardRef<TextInput, Props>(
    (
      { name, displayError = true, wrapperStyle, helperText, ...props },
      ref,
    ) => {
      const inputRef = useFocus(ref);
      const [field, meta] = useField<string>(name);
      const { onChange, onBlur } = useReactNativeHandlers(field, props.onBlur);
      return (
        <View style={wrapperStyle}>
          <TextInput
            {...props}
            mode="outlined"
            ref={inputRef as any}
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
            accessibilityLabel={props.label}
            error={meta.touched && !!meta.error}
          />
          {(displayError || !!helperText) && (
            <HelperText
              touched={meta.touched}
              error={meta.error}
              helperText={helperText}
            />
          )}
        </View>
      );
    },
  ),
);

TextField.displayName = 'TextField';
