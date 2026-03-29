import { memo } from 'react';
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
  message?: string;
}

function SuccessText({ visible, message }: Props) {
  const { t } = useTranslation();
  const trans = message ? t(message) : '';
  return (
    <HelperText
      type="error"
      visible={visible && !!message}
      style={styles.success}
    >
      {trans}
    </HelperText>
  );
}

export default memo(SuccessText);
