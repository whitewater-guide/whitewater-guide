import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import '@/i18n';

const ERROR_COLOR = '#f44336';

export interface FormikI18nError {
  key: string;
  options?: Record<string, unknown>;
}

export type FormikFieldError = string | FormikI18nError;

export interface HelperTextProps {
  helperText?: string;
  prefix?: string;
  touched: boolean;
  error?: FormikFieldError;
  warning?: boolean;
  style?: StyleProp<TextStyle>;
}

function HelperText({
  touched,
  error,
  helperText,
  warning,
  style,
  prefix = '',
}: HelperTextProps) {
  const { t } = useTranslation();
  let errorText = '';
  if (error) {
    if (typeof error === 'string') {
      errorText = t(`${prefix}${error}`);
    } else {
      try {
        errorText = t(`${prefix}${error.key}`, error.options) as string;
      } catch {
        /* Ignore */
      }
    }
  }
  const isError = !!touched && !!error;
  if (!isError && !helperText) {
    return null;
  }

  return (
    <ThemedText
      type="small"
      themeColor={isError || warning ? undefined : 'textSecondary'}
      style={[isError && styles.error, warning && styles.warning, style]}
    >
      {errorText || helperText}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  error: {
    color: ERROR_COLOR,
  },
  warning: {
    color: '#ff9800',
  },
});

export default memo(HelperText);
