import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
});

interface Props {
  prefix?: string;
  touched: boolean;
  error?: any;
  noPad?: boolean;
}

export const ErrorText: React.FC<Props> = React.memo(
  ({ touched, error, noPad, prefix = '' }) => {
    const { t } = useTranslation();
    let trans = '';
    if (error) {
      if (typeof error === 'string') {
        trans = t(`${prefix}${error}`);
      } else {
        try {
          // @ts-ignore
          trans = t(`${prefix}${error.key}`, error.options);
        } catch {}
      }
    }
    return (
      <HelperText
        type="error"
        visible={touched && !!error}
        style={noPad && styles.noPad}
      >
        {trans}
      </HelperText>
    );
  },
);

ErrorText.displayName = 'ErrorText';
