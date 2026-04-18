import { useField } from 'formik';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

import theme from '../theme';

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

function CheckboxField({ name, label }: Props) {
  const [field, , helpers] = useField<boolean>(name);
  const value = field.value ?? false;

  const onPress = useCallback(() => {
    helpers.setTouched(true);
    helpers.setValue(!value);
  }, [value, helpers]);

  return (
    <View style={styles.container}>
      <Checkbox status={value ? 'checked' : 'unchecked'} onPress={onPress} />
      <Text variant="bodyMedium" onPress={onPress}>
        {label}
      </Text>
    </View>
  );
}

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
