import format from 'date-fns/format';
import { useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import DatePickerDialog from './DatePickerDialog';

interface Props {
  name: string;
}

const DatePicker: React.FC<Props> = React.memo(({ name }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue } = useFormikContext<any>();
  const [mode, setMode] = useState<'date' | 'time' | undefined>();
  const value = new Date(values[name]) || new Date();
  const onChange = useCallback(
    (e: any, v: Date) => {
      if (Platform.OS === 'android') {
        setMode(undefined);
      }
      if (v) {
        // will be undefined if android presses 'cancel'
        setFieldTouched(name, true);
        setFieldValue(name, v.toISOString());
      }
    },
    [name, setFieldValue, setFieldTouched, setMode],
  );

  return (
    <View>
      <TouchableOpacity onPress={() => setMode('date')}>
        <TextInput
          label={t('screens:descentForm.date.startedAt.date')}
          value={format(value, 'PPP')}
          mode="outlined"
          editable={false}
          autoFocus={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode('time')}>
        <TextInput
          label={t('screens:descentForm.date.startedAt.time')}
          value={format(value, 'p')}
          mode="outlined"
          editable={false}
          autoFocus={false}
        />
      </TouchableOpacity>

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
