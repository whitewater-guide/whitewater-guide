import { strToFloat } from '@whitewater-guide/clients';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import HelperText from './HelperText';
import useFocus from './useFocus';

type TextInputProps = React.ComponentProps<typeof TextInput>;

const PARTIAL_NUMERIC = /(-)?[0-9]*([,|.][0-9]*)?/;
const numToStr = (num: any): string =>
  Number.isFinite(num) ? num!.toString() : '';

type Props = {
  name: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  displayError?: boolean;
  helperText?: string;
  helperTextStyle?: StyleProp<TextStyle>;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

const NumericField = React.memo(
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
      const {
        errors,
        touched,
        values,
        setFieldTouched,
        setFieldValue,
      } = useFormikContext<any>();
      const value = get(values, name);
      const isTouched = !!get(touched, name, false);
      const error = get(errors, name, null);
      const inputRef = useFocus(ref);
      const onBlur = useCallback(() => {
        setFieldTouched(name, true);
      }, [name, setFieldTouched]);

      const [valueStr, setValueStr] = useState(numToStr(value));

      const onChange = useCallback(
        (text: string) => {
          const match = text.match(PARTIAL_NUMERIC);
          const numPart = match ? match[0] : '';
          setValueStr(numPart);
          if (numPart !== '-') {
            const floatVal = strToFloat(numPart);
            setFieldValue(name, Number.isFinite(floatVal) ? floatVal : null);
          }
        },
        [name, setFieldValue, setValueStr],
      );

      useEffect(() => {
        if (value !== strToFloat(valueStr)) {
          setValueStr(numToStr(value));
        }
      }, [value, valueStr, setValueStr]);

      return (
        <View style={wrapperStyle}>
          <TextInput
            {...props}
            accessibilityLabel={props.label}
            mode="outlined"
            ref={inputRef as any}
            value={valueStr}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="numeric"
            error={isTouched && !!error}
          />
          {(displayError || !!helperText) && (
            <HelperText
              touched={isTouched}
              error={error}
              helperText={helperText}
              style={helperTextStyle}
            />
          )}
        </View>
      );
    },
  ),
);

NumericField.displayName = 'NumericField';

export default NumericField;
