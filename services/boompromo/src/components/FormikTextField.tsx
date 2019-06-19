import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import { Field, FieldProps } from 'formik';
import React from 'react';

interface Props extends StandardTextFieldProps {
  name: string;
}

export const FormikTextField: React.FC<Props> = ({ name, ...props }) => {
  return (
    <Field name={name}>
      {({ field, meta: { touched, error } }: FieldProps<string>) => (
        <TextField
          {...props}
          {...field}
          error={touched && !!error}
          helperText={touched && error}
        />
      )}
    </Field>
  );
};
