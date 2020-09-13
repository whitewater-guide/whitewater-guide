import { Icon, IconButton, Input, InputLabel } from '@material-ui/core';
import { InputProps } from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useField } from 'formik';
import React, { useCallback, useState } from 'react';

import { FormikFormControl } from '../helpers';

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const PasswordField: React.FC<Props> = React.memo((props) => {
  const { name, label, ...inputProps } = props;
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => {
    setShowPassword((show) => !show);
  }, [setShowPassword]);
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
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        {...inputProps}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={togglePassword}>
              {showPassword ? (
                <Icon>visibility</Icon>
              ) : (
                <Icon>visibility-off</Icon>
              )}
            </IconButton>
          </InputAdornment>
        }
        id={id}
        aria-describedby={`${id}-error`}
      />
    </FormikFormControl>
  );
});

PasswordField.displayName = 'PasswordField';
