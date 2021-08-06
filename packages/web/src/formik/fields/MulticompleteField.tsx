import { NamedNode } from '@whitewater-guide/schema';
import { useField } from 'formik';
import reject from 'lodash/reject';
import React, { useCallback } from 'react';

import {
  AutocompleteMenuProps,
  Multicomplete,
} from '../../components/autocomplete';
import { FormikFormControl } from '../helpers';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  options: NamedNode[];
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  openOnFocus?: boolean;
  menuProps?: AutocompleteMenuProps;
}

export const MulticompleteField = React.memo<Props>((props) => {
  const {
    name,
    options,
    label,
    placeholder,
    fullWidth,
    openOnFocus,
    menuProps,
  } = props;
  const [field, meta] = useField<NamedNode[]>(name);
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
        menuProps={menuProps}
      />
    </FormikFormControl>
  );
});

MulticompleteField.displayName = 'MulticompleteField';
