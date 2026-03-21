/* eslint-disable import/no-duplicates */
import addHours from 'date-fns/addHours';
import format from 'date-fns/format';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useFormikContext } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import HelperText from '~/forms/HelperText';

import DatePickerDialog from './DatePickerDialog';

interface Props {
  name: string;
  timezone?: string;
}

const DatePicker: React.FC<Props> = React.memo(({ name, timezone = 'UTC' }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue } = useFormikContext<any>();
  const [mode, setMode] = useState<'date' | 'time' | undefined>();
  const future = useRef(addHours(new Date(), 3));

  // Form value is UTC date, but it's displayed in section's timezone
  const value = utcToZonedTime(
    values[name] ? new Date(values[name]) : new Date(),
    timezone,
  );

  const onChange = useCallback(
    (e: any, v: Date) => {
      if (Platform.OS === 'android') {
        setMode(undefined);
      }
      if (v) {
        // Component value is in section's timezone, should be converted to UTC
        const utc = zonedTimeToUtc(v, timezone);
        // will be undefined if android presses 'cancel'
        setFieldTouched(name, true);
        setFieldValue(name, utc.toISOString());
      }
    },
    [name, setFieldValue, setFieldTouched, setMode, timezone],
  );

  return (
    <View>
      <View>
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

      <View>
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
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
