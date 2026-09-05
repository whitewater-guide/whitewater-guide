import { useField } from 'formik';
import { useCallback, useEffect, useState, type Ref } from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import HelperText from './helper-text';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { strToFloat } from '@/utils/str-to-float';

const PARTIAL_NUMERIC = /(-)?[0-9]*([,|.][0-9]*)?/;

function numToStr(num: unknown): string {
  return Number.isFinite(num) ? String(num) : '';
}

export interface NumericFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  displayError?: boolean;
  helperText?: string;
  helperTextStyle?: StyleProp<TextStyle>;
  ref?: Ref<TextInput>;
}

export function NumericField({
  name,
  label,
  placeholder,
  disabled = false,
  displayError = true,
  wrapperStyle,
  helperText,
  helperTextStyle,
  ref,
}: NumericFieldProps) {
  const theme = useTheme();
  const [field, meta, helpers] = useField<number | null>(name);
  const [valueStr, setValueStr] = useState(numToStr(field.value));

  const onBlur = useCallback(() => {
    helpers.setTouched(true);
  }, [helpers]);

  const onChangeText = useCallback(
    (raw: string) => {
      const match = PARTIAL_NUMERIC.exec(raw);
      const numPart = match ? match[0] : '';
      setValueStr(numPart);
      if (numPart !== '-') {
        const floatVal = strToFloat(numPart);
        helpers.setValue(Number.isFinite(floatVal) ? floatVal : null);
      }
    },
    [helpers],
  );

  const onSubmitEditing = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    if (field.value !== strToFloat(valueStr)) {
      setValueStr(numToStr(field.value));
    }
  }, [field.value, valueStr]);

  return (
    <View style={wrapperStyle}>
      {!!label && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
          {label}
        </ThemedText>
      )}
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        value={valueStr}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        keyboardType="decimal-pad"
        inputMode="decimal"
        returnKeyType="done"
        blurOnSubmit
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.backgroundSelected,
            backgroundColor: theme.backgroundElement,
          },
          disabled && styles.disabled,
        ]}
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

const styles = StyleSheet.create({
  caption: {
    marginLeft: Spacing.half,
    marginBottom: Spacing.one,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
