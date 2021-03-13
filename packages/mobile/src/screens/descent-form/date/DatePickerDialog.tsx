import DateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

type Props = React.ComponentProps<typeof DateTimePicker> & {
  mode?: IOSNativeProps['mode'] | AndroidNativeProps['mode'];
  onClose: () => void;
};

const DatePickerDialog: React.FC<Props> = (props) => {
  const { mode, onClose, ...rest } = props;
  const { t } = useTranslation();
  if (!mode) {
    return null;
  }
  // @ts-expect-error: DateTimePicker types are mixed for ios and android
  const element = <DateTimePicker mode={mode} {...rest} is24Hour={true} />;
  if (Platform.OS === 'android') {
    return element;
  }
  return (
    <Portal>
      <Dialog visible={true} onDismiss={onClose}>
        <Dialog.Content>{element}</Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>{t('commons:ok')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DatePickerDialog;
