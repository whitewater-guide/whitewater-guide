import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import Icon from '../../../components/Icon';
import { showSnackbar } from '../../../components/snackbar';
import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: 0,
    width: 48,
    height: 40,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
  },
  icon: {
    ...theme.shadow,
  },
});

function DownloadButton() {
  const { t } = useTranslation();
  return (
    <Icon
      icon="cloud-download"
      accessibilityLabel="download"
      testID="download-button"
      style={[styles.container, styles.iconContainer]}
      iconStyle={styles.icon}
      color={theme.colors.textLight}
      onPress={() => showSnackbar(t('commons:comingSoon', 'Coming soon'))}
    />
  );
}

export default memo(DownloadButton);
