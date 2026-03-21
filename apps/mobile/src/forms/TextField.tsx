import { useField } from 'formik';
import React, { forwardRef, useCallback, useState } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from './HelperText';
import useFocus from './useFocus';
import useReactNativeHandlers from './useReactNativeHandlers';

type TextInputProps = React.ComponentProps<typeof TextInput>;

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
});

type Props = {
  name: string;
  helperText?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
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
        helperTextStyle,
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
        <View style={[fullHeight && styles.fullHeight, wrapperStyle]}>
          <View style={fullHeight && styles.fullHeight} onLayout={onLayout}>
            <TextInput
              {...props}
              style={[props.style, fullHeight && !!height && { height }]}
              mode="outlined"
              ref={inputRef as any}
              value={field.value}
              onChangeText={onChange}
              onBlur={onBlur}
              accessibilityLabel={props.label as string}
              error={meta.touched && !!meta.error}
            />
          </View>
          {(displayError || !!helperText) && (
            <HelperText
              touched={meta.touched}
              error={meta.error}
              helperText={helperText}
              style={helperTextStyle}
            />
          )}
        </View>
      );
    },
  ),
);

TextField.displayName = 'TextField';

export default TextField;
