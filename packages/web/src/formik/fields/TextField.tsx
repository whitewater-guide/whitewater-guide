import Input, { InputProps } from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { useField } from 'formik';
import React, { useCallback } from 'react';

import { FormikFormControl } from '../helpers';

interface Props extends InputProps {
  name: string;
  errorFieldName?: string;
  label?: string;
}

export const TextField = React.memo<Props>((props) => {
  const { name, errorFieldName, label, ...inputProps } = props;
  const [field] = useField<string | null>(name);
  const { onChange } = field;
  const value = field.value || '';
  const handleChange = useCallback(
    (e) => {
      onChange({
        target: {
          ...e.target,
          name,
          value: e.target.value || null,
        },
      });
    },
    [onChange, name],
  );
  const id = `textfield-${name}`;
  return (
    <FormikFormControl
      name={name}
      inputId={id}
      fullWidth={props.fullWidth}
      errorFieldName={errorFieldName}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        {...field}
        name={name}
        value={value}
        onChange={handleChange}
        {...inputProps}
        id={id}
        aria-describedby={`${id}-error`}
      />
    </FormikFormControl>
  );
});

TextField.displayName = 'TextField';
