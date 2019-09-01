import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { HelperText as PaperHelperText } from 'react-native-paper';

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
});

interface Props {
  helperText?: string;
  prefix?: string;
  touched: boolean;
  error?: any;
  noPad?: boolean;
}

export const HelperText: React.FC<Props> = React.memo(
  ({ touched, error, noPad, helperText, prefix = '' }) => {
    const { t } = useTranslation();
    let errorText = '';
    if (error) {
      if (typeof error === 'string') {
        errorText = t(`${prefix}${error}`);
      } else {
        try {
          // @ts-ignore
          errorText = t(`${prefix}${error.key}`, error.options);
        } catch {}
      }
    }
    const isError = !!touched && !!error;
    return (
      <PaperHelperText
        type={isError ? 'error' : 'info'}
        visible={isError || !!helperText}
        style={noPad && styles.noPad}
      >
        {errorText || helperText}
      </PaperHelperText>
    );
  },
);

HelperText.displayName = 'HelperText';
