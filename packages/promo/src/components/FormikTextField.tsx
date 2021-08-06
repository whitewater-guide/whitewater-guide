import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import { Field, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { translateError } from '../utils';

interface Props extends StandardTextFieldProps {
  name: string;
}

export const FormikTextField: React.FC<Props> = ({ name, ...props }) => {
  const { t } = useTranslation();
  return (
    <Field name={name}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <TextField
          {...props}
          {...field}
          error={touched && !!error}
          helperText={touched && translateError(t, error)}
        />
      )}
    </Field>
  );
};
