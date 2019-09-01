import { strToFloat } from '@whitewater-guide/clients';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { Omit } from 'type-zoo';
import { HelperText } from './HelperText';
import useFocus from './useFocus';

const PARTIAL_NUMERIC = /(-)?[0-9]*([,|.][0-9]*)?/;
const numToStr = (num: any): string =>
  Number.isFinite(num) ? num!.toString() : '';

type Props = {
  name: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  displayError?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

export const NumericField = React.memo(
  forwardRef<TextInput, Props>(
    ({ name, displayError = true, wrapperStyle, ...props }, ref) => {
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
            mode="outlined"
            ref={inputRef as any}
            value={valueStr}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="numeric"
            error={isTouched && !!error}
          />
          {displayError && <HelperText touched={isTouched} error={error} />}
        </View>
      );
    },
  ),
);

NumericField.displayName = 'NumericField';
