import FormHelperText from '@material-ui/core/FormHelperText';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  inputId?: string;
  error?: string | { key: string; options?: Record<string, string> };
}

export const ErrorText = React.memo<Props>(({ inputId, error }) => {
  const id = inputId ? `${inputId}-error` : undefined;
  const { t } = useTranslation();
  const errorText = error
    ? typeof error === 'object'
      ? t(error.key, error.options)
      : t(error)
    : '';
  return <FormHelperText id={id}>{errorText}</FormHelperText>;
});

ErrorText.displayName = 'ErrorText';
