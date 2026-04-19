import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

type Props = React.ComponentProps<typeof DateTimePicker> & {
  mode?: 'date' | 'time';
  onClose: () => void;
};

function DatePickerDialog({ mode, onClose, ...rest }: Props) {
  const { t } = useTranslation();
  if (!mode) {
    return null;
  }
  const element = (
    // @ts-expect-error: display 'inline' and is24Hour are valid but not in shared types
    <DateTimePicker
      mode={mode}
      display={
        Platform.OS === 'ios'
          ? mode === 'time'
            ? 'spinner'
            : 'inline'
          : 'default'
      }
      {...rest}
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
}

export default DatePickerDialog;
