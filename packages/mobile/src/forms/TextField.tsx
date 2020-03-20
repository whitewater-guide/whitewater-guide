import { useField } from 'formik';
import React, { forwardRef, useCallback, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import HelperText from './HelperText';
import useFocus from './useFocus';
import useReactNativeHandlers from './useReactNativeHandlers';

type TextInputProps = React.ComponentProps<typeof TextInput>;

type Props = {
  name: string;
  helperText?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  displayError?: boolean;
  fullHeight?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

const TextField = React.memo(
  forwardRef<any, Props>(
    (
      {
        name,
        displayError = true,
        wrapperStyle,
        helperText,
        fullHeight,
        ...props
      },
      ref,
    ) => {
      const inputRef = useFocus(ref);
      const [field, meta] = useField<string>(name);
      const { onChange, onBlur } = useReactNativeHandlers(field, props.onBlur);
      const [height, setHeight] = useState<number | undefined>(undefined);
      const onLayout = useCallback(
        (e) => {
          setHeight(e.nativeEvent.layout.height);
        },
        [setHeight],
      );
      return (
        <View style={wrapperStyle} onLayout={onLayout}>
          <TextInput
            {...props}
            style={[props.style, fullHeight && height && { height }]}
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

export default TextField;
