import { useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';
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

export function ModalPickerField<V>(props: Props<V>) {
  const {
    label,
    placeholder,
    name,
    options,
    keyExtractor,
    valueToString,
    itemStyle,
  } = props;
  const [open, setOpen] = useState(false);

  const { values, errors, touched, setFieldTouched, setFieldValue } =
    useFormikContext<any>();

  const onPress = useCallback(() => {
    setOpen(true);
    setFieldTouched(name, true);
  }, [name, setFieldTouched, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const onItemPress = useCallback(
    (value: V) => {
      setFieldValue(name, value);
      close();
    },
    [name, setFieldValue, close],
  );
  return (
    <>
      <TouchableWithoutFeedback onPress={onPress} accessibilityLabel={label}>
        <View pointerEvents="box-only">
          <TextInput
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={valueToString(values[name])}
            editable={false}
            testID={`${name}-fake-input`}
          />
          <HelperText touched={!!touched[name]} error={errors[name]} />
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
              value={values[name]}
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
