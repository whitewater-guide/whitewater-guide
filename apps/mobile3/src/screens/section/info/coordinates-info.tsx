import * as Clipboard from 'expo-clipboard';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Coordinates } from '@/types/coordinates';
import { arrayToLatLngString } from '@/utils/geo';

export interface CoordRowProps {
  label: string;
  coordinates: Coordinates;
}

function CoordRow({ label, coordinates }: CoordRowProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const prettyCoord = arrayToLatLngString(coordinates);

  const onCopy = useCallback(() => {
    void Clipboard.setStringAsync(prettyCoord);
  }, [prettyCoord]);

  return (
    <View style={styles.row}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.right}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {prettyCoord}
        </ThemedText>
        <Icon
          icon="content-copy"
          size={20}
          accessibilityLabel={t('commons:copy')}
          onPress={onCopy}
        />
      </View>
    </View>
  );
}

export interface CoordinatesInfoProps {
  putIn?: Coordinates | null;
  takeOut?: Coordinates | null;
}

export default function CoordinatesInfo({
  putIn,
  takeOut,
}: CoordinatesInfoProps) {
  const { t } = useTranslation();

  if (!putIn && !takeOut) {
    return null;
  }

  return (
    <View>
      {!!putIn && <CoordRow label={t('commons:putIn')} coordinates={putIn} />}
      {!!takeOut && (
        <CoordRow label={t('commons:takeOut')} coordinates={takeOut} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
