import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import type { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { StepFooter } from '../../components';

const useStyles = makeStyles((theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(),
    },
  }),
);

export type Props = Omit<StepProps, 'classes'> & {
  value?: string;
  onChange?: (value: string) => void;

  loading?: boolean;
  error?: string | null;

  next?: () => void;
  prev?: () => void;
};

const EnterCodeView: React.FC<Props> = (props) => {
  const { value, onChange, loading, error, next, prev, ...stepContentProps } =
    props;
  const isValid = !error && value && value.length >= 8;

  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <StepContent {...stepContentProps}>
      <FormControl className={classes.formControl} error={!!error}>
        <InputLabel htmlFor="code">{t('enter:code')}</InputLabel>
        <Input
          id="code"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
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

export default EnterCodeView;
