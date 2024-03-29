import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

import SwipeableStarRating from '~/components/SwipeableStarRating';

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

const RatingField: React.FC<Props> = React.memo((props) => {
  const { name, label } = props;
  const { values, setFieldTouched, setFieldValue } = useFormikContext<any>();
  const value = values[name] || 0;
  const onChange = useCallback(
    (v: number) => {
      setFieldTouched(name, true);
      setFieldValue(name, v || null);
    },
    [name, setFieldValue, setFieldTouched],
  );
  return (
    <View style={styles.container}>
      <Paragraph style={styles.caption}>{label}</Paragraph>
      <SwipeableStarRating value={value} onChange={onChange} />
    </View>
  );
});

RatingField.displayName = 'RatingField';

export default RatingField;
