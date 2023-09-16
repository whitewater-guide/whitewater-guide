import {
  FormControl,
  FormHelperText,
  Icon,
  IconButton,
  Input,
  InputLabel,
} from '@material-ui/core';
import type { InputProps } from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import type { FieldProps } from 'formik';
import { Field } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translateError } from '../utils';

interface Props extends InputProps {
  name: string;
  label: string;
}

export const FormikPasswordField: React.FC<Props> = ({
  name,
  label,
  ...props
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);
  return (
    <Field name={name}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <FormControl fullWidth>
          <InputLabel htmlFor="password">{label}</InputLabel>
          <Input
            {...props}
            {...field}
            placeholder={label}
            id="password"
            type={showPassword ? 'text' : 'password'}
            error={touched && !!error}
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
          />
          <FormHelperText error={touched && !!error}>
            {touched && translateError(t, error)}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
};
