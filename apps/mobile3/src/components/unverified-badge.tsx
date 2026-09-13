import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

function UnverifiedBadge() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View style={[styles.unverified, { borderColor: theme.textSecondary }]}>
      <ThemedText
        type="small"
        themeColor="textSecondary"
        style={styles.unverifiedText}
      >
        {t('commons:unverified')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  unverified: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    padding: 2,
  },
  unverifiedText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default memo(UnverifiedBadge);
