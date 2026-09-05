import { useField } from 'formik';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { SwipeableStarRating } from '@/components/star-rating/swipeable-star-rating';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface RatingFieldProps {
  name: string;
  label: string;
}

export function RatingField({ name, label }: RatingFieldProps) {
  const [field, , helpers] = useField<number | null>(name);
  const value = field.value ?? 0;

  const onChange = useCallback(
    (next: number) => {
      helpers.setTouched(true);
      helpers.setValue(next || null);
    },
    [helpers],
  );

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
        {label}
      </ThemedText>
      <SwipeableStarRating value={value} onChange={onChange} />
    </View>
  );
}

RatingField.displayName = 'RatingField';

const styles = StyleSheet.create({
  caption: {
    marginLeft: Spacing.half,
    marginBottom: Spacing.one,
  },
  container: {
    alignItems: 'flex-start',
  },
});
