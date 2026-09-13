import type { MediaKind } from '@whitewater-guide/schema';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface NoMediaProps {
  kind: MediaKind;
}

function NoMedia({ kind }: NoMediaProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ThemedText type="default">
        {t(`screens:section.media.noMedia.${kind}`)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
  },
});

export default NoMedia;
