import { Checkbox, Host } from '@expo/ui';
import { useField } from 'formik';
import { useCallback } from 'react';

export interface CheckboxFieldProps {
  name: string;
  label: string;
}

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const [field, , helpers] = useField<boolean>(name);
  const value = field.value ?? false;

  const onValueChange = useCallback(
    (next: boolean) => {
      helpers.setTouched(true);
      helpers.setValue(next);
    },
    [helpers],
  );

  return (
    <Host matchContents>
      <Checkbox value={value} onValueChange={onValueChange} label={label} />
    </Host>
  );
}

CheckboxField.displayName = 'CheckboxField';
