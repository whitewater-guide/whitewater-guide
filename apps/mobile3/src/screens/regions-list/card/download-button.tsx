import { Alert, StyleSheet } from 'react-native';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';

const ICON_SHADOW = {
  textShadowColor: '#000000',
  textShadowOffset: { width: 0.75, height: 0.75 },
  textShadowRadius: 1.5,
};

function DownloadButton() {
  const { t } = useTranslation();
  return (
    <Icon
      icon="cloud-download"
      accessibilityLabel="download"
      testID="download-button"
      style={[styles.container, styles.iconContainer]}
      iconStyle={styles.icon}
      color="#ffffff"
      onPress={() => Alert.alert(t('commons:comingSoon'))}
    />
  );
}

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
    paddingTop: Spacing.one,
  },
  icon: ICON_SHADOW,
});

export default memo(DownloadButton);
