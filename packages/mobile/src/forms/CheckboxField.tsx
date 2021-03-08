import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Paragraph } from 'react-native-paper';

import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.margin.half,
  },
});

interface Props {
  name: string;
  label: string;
}

const CheckboxField: React.FC<Props> = React.memo((props) => {
  const { name, label } = props;
  const { values, setFieldTouched, setFieldValue } = useFormikContext<any>();
  const value = values[name] || false;
  const onPress = useCallback(() => {
    setFieldTouched(name, true);
    setFieldValue(name, !value);
  }, [name, value, setFieldValue, setFieldTouched]);
  return (
    <View style={styles.container}>
      <Checkbox status={value ? 'checked' : 'unchecked'} onPress={onPress} />
      <Paragraph onPress={onPress}>{label}</Paragraph>
    </View>
  );
});

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
