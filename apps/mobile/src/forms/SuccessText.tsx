import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';

import theme from '../theme';

const styles = StyleSheet.create({
  success: {
    color: theme.colors.enabled,
  },
});

interface Props {
  visible: boolean;
  message?: any;
}

const SuccessText: React.FC<Props> = React.memo(({ visible, message }) => {
  const { t } = useTranslation();
  let trans = '';
  if (message) {
    if (typeof message === 'string') {
      trans = t(message);
    } else {
      try {
        trans = t(message.key, message.options) as string;
      } catch {
        /* Ignore */
      }
    }
  }
  return (
    <HelperText
      type="error"
      visible={visible && !!message}
      style={styles.success}
    >
      {trans}
    </HelperText>
  );
});

SuccessText.displayName = 'ErrorText';

export default SuccessText;
