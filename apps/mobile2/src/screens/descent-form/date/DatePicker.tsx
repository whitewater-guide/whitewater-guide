import addHours from 'date-fns/addHours';
import format from 'date-fns/format';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useField } from 'formik';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from '../../../forms/HelperText';
import DatePickerDialog from './DatePickerDialog';

interface Props {
  name: string;
  timezone?: string;
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
  },
});

function DatePicker({ name, timezone = 'UTC' }: Props) {
  const { t } = useTranslation();
  const [, , helpers] = useField<string>(name);
  const [, , valueHelpers] = useField<string>(name);
  const [fieldValue, , fieldHelpers] = useField<string>(name);
  const [mode, setMode] = useState<'date' | 'time' | undefined>();
  const future = useRef(addHours(new Date(), 3));

  const value = utcToZonedTime(
    fieldValue.value ? new Date(fieldValue.value) : new Date(),
    timezone,
  );

  const onChange = useCallback(
    (_e: any, v?: Date) => {
      if (Platform.OS === 'android') {
        setMode(undefined);
      }
      if (v) {
        const utc = zonedTimeToUtc(v, timezone);
        fieldHelpers.setTouched(true);
        fieldHelpers.setValue(utc.toISOString());
      }
    },
    [fieldHelpers, timezone],
  );

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          label={t('screens:descentForm.date.startedAt.date')}
          value={format(value, 'PPP')}
          mode="outlined"
          editable={false}
          autoFocus={false}
        />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={() => setMode('date')}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          label={t('screens:descentForm.date.startedAt.time')}
          value={format(value, 'p')}
          mode="outlined"
          editable={false}
          autoFocus={false}
        />
        {value > future.current && (
          <HelperText
            helperText={t('screens:descentForm.date.futureWarning')}
            touched
            warning
            noPad
          />
        )}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={() => setMode('time')}
        />
      </View>

      <DatePickerDialog
        mode={mode}
        onChange={onChange}
        value={value}
        onClose={() => setMode(undefined)}
      />
    </View>
  );
}

export default DatePicker;
