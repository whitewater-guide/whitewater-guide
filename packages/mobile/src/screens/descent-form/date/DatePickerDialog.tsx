import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

type Props = React.ComponentProps<typeof DateTimePicker> & {
  mode?: 'date' | 'time';
  onClose: () => void;
};

const DatePickerDialog: React.FC<Props> = (props) => {
  const { mode, onClose, ...rest } = props;
  const { t } = useTranslation();
  if (!mode) {
    return null;
  }
  const element = (
    <DateTimePicker
      mode={mode}
      display={Platform.OS === 'ios' ? 'compact' : 'default'}
      {...rest}
      // @ts-expect-error: DateTimePicker types are mixed for ios and android
      is24Hour
    />
  );
  if (Platform.OS === 'android') {
    return element;
  }
  return (
    <Portal>
      <Dialog visible onDismiss={onClose}>
        <Dialog.Content>{element}</Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>{t('commons:ok')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DatePickerDialog;
