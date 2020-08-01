import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { HelperText as PaperHelperText } from 'react-native-paper';
import theme from '~/theme';

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  warning: {
    color: theme.colors.accent,
  },
});

interface Props {
  helperText?: string;
  prefix?: string;
  touched: boolean;
  error?: any;
  warning?: boolean;
  noPad?: boolean;
}

const HelperText: React.FC<Props> = React.memo(
  ({ touched, error, noPad, helperText, warning, prefix = '' }) => {
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
        style={[noPad && styles.noPad, warning && styles.warning]}
      >
        {errorText || helperText}
      </PaperHelperText>
    );
  },
);

HelperText.displayName = 'HelperText';

export default HelperText;
