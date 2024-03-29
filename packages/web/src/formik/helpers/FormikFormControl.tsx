import type { FormControlProps } from '@material-ui/core/FormControl';
import FormControl from '@material-ui/core/FormControl';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import React from 'react';

import { ErrorText } from './ErrorText';

interface Props extends FormControlProps {
  inputId?: string;
  name: string;
  errorFieldName?: string;
}

export const FormikFormControl = React.memo<Props>((props) => {
  const {
    name,
    errorFieldName,
    inputId,
    children,
    id: _id,
    ...formControlProps
  } = props;
  const { errors, touched, submitCount } = useFormikContext<unknown>();
  const error = get(errors, errorFieldName || name);
  const fieldTouched = !!get(touched, name);
  const showError = (fieldTouched || submitCount > 0) && !!error;

  return (
    <FormControl error={showError} {...formControlProps}>
      {children}
      <ErrorText inputId={inputId} error={showError ? error : ''} />
    </FormControl>
  );
});

FormikFormControl.displayName = 'FormikFormControl';
