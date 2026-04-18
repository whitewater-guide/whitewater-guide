import { useField } from 'formik';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { SwipeableStarRating } from '../components/star-rating';
import theme from '../theme';

const styles = StyleSheet.create({
  caption: {
    color: theme.colors.componentBorder,
    marginLeft: 2,
    marginBottom: 0,
  },
  container: {
    alignItems: 'flex-start',
  },
});

interface Props {
  name: string;
  label: string;
}

function RatingField({ name, label }: Props) {
  const [field, , helpers] = useField<number | null>(name);
  const value = field.value ?? 0;

  const onChange = useCallback(
    (v: number) => {
      helpers.setTouched(true);
      helpers.setValue(v || null);
    },
    [helpers],
  );

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium" style={styles.caption}>
        {label}
      </Text>
      <SwipeableStarRating value={value} onChange={onChange} />
    </View>
  );
}

RatingField.displayName = 'RatingField';

export default RatingField;
