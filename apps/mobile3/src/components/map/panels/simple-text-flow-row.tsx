import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SimpleTextFlowRowProps {
  flowsText?: string | null;
  style?: StyleProp<ViewStyle>;
}

export default function SimpleTextFlowRow({
  flowsText,
  style,
}: SimpleTextFlowRowProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: theme.backgroundSelected },
        style,
      ]}
    >
      <ThemedText type="smallBold">{t('commons:flows')}</ThemedText>
      <ThemedText type="small" numberOfLines={1}>
        {flowsText || t('commons:unknown')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
});
