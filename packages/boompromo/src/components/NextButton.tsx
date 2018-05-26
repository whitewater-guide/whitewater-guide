import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';

type ClassNames = 'buttonProgress' | 'wrapper';

const styles: StyleRulesCallback<ClassNames> = () => ({
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
});

interface Props extends WithStyles<ClassNames> {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  label?: string;
}

const NextButtonInner: React.SFC<Props> = ({ classes, loading, disabled, onClick, label = 'Продолжить' }) => (
  <div className={classes.wrapper}>
    <Button
      variant="raised"
      color="primary"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
  </div>
);

export const NextButton = withStyles(styles)(NextButtonInner);
