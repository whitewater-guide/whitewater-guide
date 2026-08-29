import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const PRIMARY = '#0078B4';

export interface StoryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined';
}

export function StoryButton({
  label,
  onPress,
  variant = 'filled',
}: StoryButtonProps) {
  const filled = variant === 'filled';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        filled
          ? styles.filled
          : styles.outlined,
      ]}
    >
      <ThemedText
        type="smallBold"
        style={filled ? styles.filledLabel : styles.outlinedLabel}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <ThemedText type="smallBold" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" style={styles.rowValue}>
        {value}
      </ThemedText>
    </View>
  );
}

export function formatNullable(value: string | number | boolean | null | undefined): string {
  if (value == null) {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  filled: {
    backgroundColor: PRIMARY,
  },
  outlined: {
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  filledLabel: {
    color: '#ffffff',
  },
  outlinedLabel: {
    color: PRIMARY,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
  },
  rowLabel: {
    flexShrink: 0,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
  },
});
