import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(),
    },
    button: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
      color: '#FFFFFF',
      backgroundColor: '#3B5998',
      '&:hover': {
        backgroundColor: '#003069',
      },
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -8,
      marginLeft: -12,
    },
    wrapper: {
      display: 'inline',
      position: 'relative',
    },
  }),
);

type Props = Omit<ButtonProps, 'classes'> & {
  loading?: boolean;
};

const FacebookButton: React.FC<Props> = ({
  disabled,
  loading,
  onClick,
  ...props
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.wrapper}>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        {...props}
        disabled={disabled || loading}
        className={classes.button}
        onClick={loading ? undefined : onClick}
      >
        <SvgIcon className={classes.icon}>
          <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
        </SvgIcon>
        {t('login:facebookButton')}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};

export default FacebookButton;
