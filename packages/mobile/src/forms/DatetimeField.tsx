import DatePicker from 'react-native-date-picker';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import theme from '../theme';

const styles = StyleSheet.create({
  caption: {
    color: theme.colors.componentBorder,
    marginLeft: 2,
    marginBottom: 0,
  },
  wheel: {
    alignSelf: 'center',
  },
});

interface Props {
  name: string;
  label: string;
}

const DatetimeField: React.FC<Props> = React.memo((props) => {
  const { name, label } = props;
  const { values, setFieldTouched, setFieldValue } = useFormikContext<any>();
  const value = values[name] || new Date();
  const onChange = useCallback(
    (v: Date) => {
      setFieldTouched(name, true);
      setFieldValue(name, v);
    },
    [name, setFieldValue, setFieldTouched],
  );
  return (
    <React.Fragment>
      <View>
        <Paragraph style={styles.caption}>{label}</Paragraph>
        <DatePicker
          date={value}
          mode="datetime"
          onDateChange={onChange}
          style={styles.wheel}
          androidVariant="nativeAndroid"
        />
      </View>
    </React.Fragment>
  );
});

DatetimeField.displayName = 'DatetimeField';

export default DatetimeField;
