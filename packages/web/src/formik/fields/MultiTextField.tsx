import { useField } from 'formik';
import reject from 'lodash/reject';
import MUIChipInput from 'material-ui-chip-input';
import React, { useCallback } from 'react';

import { FormikFormControl } from '../helpers';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const MultiTextField: React.FC<Props> = React.memo((props) => {
  const { name, label, placeholder, fullWidth } = props;
  const [field, meta] = useField<string[]>(name);
  const hasError = meta.touched && !!meta.error;
  const { value } = field;

  const { onChange } = useFakeHandlers(name);

  const onAdd = useCallback(
    (chip: string) => {
      onChange([...value, chip]);
    },
    [value, onChange],
  );

  const onDelete = useCallback(
    (chip: string) => {
      onChange(reject(value, (v) => v === chip));
    },
    [value, onChange],
  );

  const onBlur = useCallback(
    (event: any) => {
      const newItem = event.target.value;
      if (newItem) {
        onChange([...value, newItem]);
      }
    },
    [value, onChange],
  );

  return (
    <FormikFormControl name={name} fullWidth={fullWidth}>
      <MUIChipInput
        fullWidth={fullWidth}
        value={value}
        label={hasError ? meta.error : label}
        placeholder={placeholder}
        onAdd={onAdd}
        onDelete={onDelete}
        onBlur={onBlur}
        newChipKeyCodes={[13, 188, 59]}
        InputProps={{
          onBlur,
          error: hasError,
        }}
      />
    </FormikFormControl>
  );
});

MultiTextField.displayName = 'MultiTextField';
