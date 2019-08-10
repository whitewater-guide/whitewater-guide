import FormHelperText from '@material-ui/core/FormHelperText';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  inputId?: string;
  error: any;
}

export const ErrorText: React.FC<Props> = React.memo(({ inputId, error }) => {
  const id = inputId ? `${inputId}-error` : undefined;
  const { t } = useTranslation();
  const errorText = !!error
    ? typeof error === 'object'
      ? t(error.key, error.options)
      : t(error)
    : '';
  return <FormHelperText id={id}>{errorText}</FormHelperText>;
});

ErrorText.displayName = 'ErrorText';
