import { useField } from 'formik';
import { useCallback, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Modal, Portal, Surface, TextInput } from 'react-native-paper';

import theme from '../../theme';
import HelperText from '../HelperText';
import ModalPickerList from './ModalPickerList';

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    backgroundColor: theme.colors.primaryBackground,
    borderRadius: theme.rounding.single,
    elevation: 24,
    height: theme.rowHeight * 6,
  },
});

interface Props<V> {
  label: string;
  placeholder?: string;
  name: string;
  valueToString: (value: V) => string;
  options: V[];
  keyExtractor: (value: V) => string;
  itemStyle?: StyleProp<ViewStyle>;
}

export function ModalPickerField<V>({
  label,
  placeholder,
  name,
  options,
  keyExtractor,
  valueToString,
  itemStyle,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [field, meta, helpers] = useField<V>(name);

  const onPress = useCallback(() => {
    setOpen(true);
    helpers.setTouched(true);
  }, [helpers]);

  const close = useCallback(() => setOpen(false), []);

  const onItemPress = useCallback(
    (value: V) => {
      helpers.setValue(value);
      close();
    },
    [helpers, close],
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={onPress} accessibilityLabel={label}>
        <View pointerEvents="box-only">
          <TextInput
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={valueToString(field.value)}
            editable={false}
            testID={`${name}-fake-input`}
          />
          <HelperText touched={meta.touched} error={meta.error} />
        </View>
      </TouchableWithoutFeedback>
      <Portal>
        <Modal
          visible={open}
          onDismiss={close}
          contentContainerStyle={styles.modal}
          dismissable
        >
          <Surface style={styles.surface}>
            <ModalPickerList<V>
              value={field.value}
              onItemPress={onItemPress}
              valueToString={valueToString}
              options={options}
              keyExtractor={keyExtractor}
              itemStyle={itemStyle}
            />
          </Surface>
        </Modal>
      </Portal>
    </>
  );
}

ModalPickerField.displayName = 'ModalPickerField';
