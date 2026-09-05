import { BottomSheet, Button, Column, Text } from '@expo/ui';
import { useField } from 'formik';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import HelperText from './helper-text';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ModalPickerFieldProps<V> {
  label: string;
  placeholder?: string;
  name: string;
  valueToString: (value: V) => string;
  options: V[];
  keyExtractor: (value: V) => string;
}

export function ModalPickerField<V>({
  label,
  placeholder,
  name,
  options,
  keyExtractor,
  valueToString,
}: ModalPickerFieldProps<V>) {
  const theme = useTheme();
  const [field, meta, helpers] = useField<V | null>(name);
  const [open, setOpen] = useState(false);

  const display =
    field.value == null ? (placeholder ?? '') : valueToString(field.value);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    helpers.setTouched(true);
    setOpen(true);
  }, [helpers]);

  const onSelect = useCallback(
    (next: V) => {
      helpers.setValue(next);
      setOpen(false);
    },
    [helpers],
  );

  return (
    <View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
        {label}
      </ThemedText>
      <Pressable
        accessibilityLabel={label}
        onPress={onOpen}
        testID={`${name}-picker`}
        style={[
          styles.field,
          {
            borderColor: theme.backgroundSelected,
            backgroundColor: theme.backgroundElement,
          },
        ]}
      >
        <ThemedText
          numberOfLines={1}
          themeColor={field.value == null ? 'textSecondary' : 'text'}
          style={styles.value}
        >
          {display}
        </ThemedText>
        <Icon icon="chevron-down" size={20} color={theme.textSecondary} />
      </Pressable>
      <BottomSheet isPresented={open} onDismiss={close}>
        <Column spacing={Spacing.one}>
          <Text textStyle={{ fontSize: 16, fontWeight: '600' }}>{label}</Text>
          {options.map((option) => {
            const key = keyExtractor(option);
            const selected =
              field.value != null && keyExtractor(field.value) === key;
            return (
              <Button
                key={key}
                variant={selected ? 'filled' : 'outlined'}
                label={valueToString(option)}
                onPress={() => onSelect(option)}
              />
            );
          })}
        </Column>
      </BottomSheet>
      <HelperText touched={meta.touched} error={meta.error} />
    </View>
  );
}

ModalPickerField.displayName = 'ModalPickerField';

const styles = StyleSheet.create({
  caption: {
    marginLeft: Spacing.half,
    marginBottom: Spacing.one,
  },
  field: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  value: {
    flex: 1,
  },
});
