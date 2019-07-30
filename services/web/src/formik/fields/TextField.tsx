import Input, { InputProps } from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { useField } from 'formik';
import React, { useCallback } from 'react';
import { FormikFormControl } from '../helpers';

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const TextField: React.FC<Props> = React.memo((props) => {
  const { name, label, ...inputProps } = props;
  const [field] = useField<string | null>(name);
  const value = field.value || '';
  const onChange = useCallback(
    (e) => {
      field.onChange({
        target: {
          ...e.target,
          name,
          value: e.target.value || null,
        },
      });
    },
    [field.onChange, name],
  );
  const id = `textfield-${name}`;
  return (
    <FormikFormControl name={name} inputId={id} fullWidth={props.fullWidth}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        {...field}
        name={name}
        value={value}
        onChange={onChange}
        {...inputProps}
        id={id}
        aria-describedby={`${id}-error`}
      />
    </FormikFormControl>
  );
});

TextField.displayName = 'TextField';
