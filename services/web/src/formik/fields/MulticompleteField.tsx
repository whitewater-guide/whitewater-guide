import { NamedNode } from '@whitewater-guide/commons';
import { useField } from 'formik';
import reject from 'lodash/reject';
import React, { useCallback } from 'react';
import { Multicomplete } from '../../components/autocomplete';
import { FormikFormControl } from '../helpers';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  options: NamedNode[];
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  openOnFocus?: boolean;
}

export const MulticompleteField: React.FC<Props> = React.memo((props) => {
  const { name, options, label, placeholder, fullWidth, openOnFocus } = props;
  const [field, meta] = useField(name);
  const { onChange, onBlur } = useFakeHandlers(name);
  const hasError = meta.touched && !!meta.error;

  const onAdd = useCallback(
    (chip: NamedNode) => {
      const value = field.value || [];
      onChange([...value, chip]);
    },
    [onChange, field.value],
  );

  const onDelete = useCallback(
    (id: string) => {
      onChange(reject(field.value, { id }));
    },
    [onChange, field.value],
  );

  return (
    <FormikFormControl name={name} fullWidth={fullWidth}>
      <Multicomplete
        options={options}
        values={field.value}
        onAdd={onAdd}
        onDelete={onDelete}
        openOnFocus={openOnFocus}
        label={hasError ? meta.error : label}
        placeholder={placeholder}
        InputProps={{
          error: hasError,
          onBlur,
        }}
        InputLabelProps={{
          error: hasError,
        }}
      />
    </FormikFormControl>
  );
});

MulticompleteField.displayName = 'MulticompleteField';
