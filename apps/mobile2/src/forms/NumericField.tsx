import { strToFloat } from '@whitewater-guide/clients';
import { useField } from 'formik';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from './HelperText';
import useFocus from './useFocus';

type TextInputProps = React.ComponentProps<typeof TextInput>;

const PARTIAL_NUMERIC = /(-)?[0-9]*([,|.][0-9]*)?/;
const numToStr = (num: unknown): string =>
  Number.isFinite(num) ? String(num) : '';

type Props = {
  name: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  displayError?: boolean;
  helperText?: string;
  helperTextStyle?: StyleProp<TextStyle>;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'>;

function NumericField(
  {
    name,
    displayError = true,
    wrapperStyle,
    helperText,
    helperTextStyle,
    ...props
  }: Props,
  ref: React.Ref<any>,
) {
  const [field, meta, helpers] = useField<number | null>(name);
  const inputRef = useFocus(ref);

  const onBlur = useCallback(() => {
    helpers.setTouched(true);
  }, [helpers]);

  const [valueStr, setValueStr] = useState(numToStr(field.value));

  const onChange = useCallback(
    (text: string) => {
      const match = PARTIAL_NUMERIC.exec(text);
      const numPart = match ? match[0] : '';
      setValueStr(numPart);
      if (numPart !== '-') {
        const floatVal = strToFloat(numPart);
        helpers.setValue(Number.isFinite(floatVal) ? floatVal : null);
      }
    },
    [helpers],
  );

  useEffect(() => {
    if (field.value !== strToFloat(valueStr)) {
      setValueStr(numToStr(field.value));
    }
  }, [field.value, valueStr]);

  return (
    <View style={wrapperStyle}>
      <TextInput
        {...props}
        accessibilityLabel={props.label as string}
        mode="outlined"
        ref={inputRef as any}
        value={valueStr}
        onChangeText={onChange}
        onBlur={onBlur}
        keyboardType="numeric"
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
}

NumericField.displayName = 'NumericField';

export default forwardRef(NumericField);
