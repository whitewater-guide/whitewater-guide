import type { ButtonProps } from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() =>
  createStyles({
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    wrapper: {
      display: 'inline',
      position: 'relative',
    },
  }),
);

interface Props extends Omit<ButtonProps, 'classes'> {
  disabled: boolean;
  loading: boolean;
  onClick?: () => void;
  label?: string;
}

export const NextButton: React.FC<Props> = ({
  loading,
  disabled,
  onClick,
  label,
  ...props
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.wrapper}>
      <Button
        {...props}
        variant="contained"
        color="primary"
        disabled={disabled || loading}
        onClick={loading ? undefined : onClick}
      >
        {label || t('main:nextStepButton')}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
