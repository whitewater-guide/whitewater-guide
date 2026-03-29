import { useField } from 'formik';
import { forwardRef, memo } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from './HelperText';
import useReactNativeHandlers from './useReactNativeHandlers';

type TextInputProps = React.ComponentProps<typeof TextInput>;

type Props = {
  name: string;
  helperText?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  displayError?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

const TextField = memo(
  forwardRef<any, Props>(
    (
      {
        name,
        displayError = true,
        wrapperStyle,
        helperText,
        helperTextStyle,
        ...props
      },
      ref,
    ) => {
      const [field, meta] = useField<string>(name);
      const { onChange, onBlur } = useReactNativeHandlers(field, props.onBlur);
      return (
        <View style={wrapperStyle}>
          <TextInput
            {...props}
            mode="outlined"
            ref={ref}
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
            accessibilityLabel={props.label as string}
            error={meta.touched && !!meta.error}
          />
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
