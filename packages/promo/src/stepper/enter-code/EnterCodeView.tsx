import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import StepContent from '@material-ui/core/StepContent';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { StepFooter } from '../../components';

const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(),
    },
  });

export interface EnterCodeViewProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;

  loading?: boolean;
  error?: string | null;

  next?: () => void;
  prev?: () => void;
}

type Props = EnterCodeViewProps & WithStyles<typeof styles>;

const EnterCodeView: React.FC<Props> = (props) => {
  const {
    value,
    onChange,
    loading,
    error,
    classes,
    next,
    prev,
    ...stepContentProps
  } = props;
  const isValid = !error && value && value.length >= 8;
  const { t } = useTranslation();
  return (
    <StepContent {...stepContentProps}>
      <FormControl className={classes.formControl} error={!!error}>
        <InputLabel htmlFor="code">{t('enter:code')}</InputLabel>
        <Input id="code" value={value} onChange={onChange} />
        <FormHelperText id="code-error">{error}</FormHelperText>
      </FormControl>
      <StepFooter
        onPrev={prev}
        onNext={next}
        nextDisabled={!isValid}
        nextLoading={!!loading}
      />
    </StepContent>
  );
};

export default withStyles(styles)(EnterCodeView);
