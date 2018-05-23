import { StyleRulesCallback } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React from 'react';
import { Omit } from 'type-zoo';
import FacebookIcon from './FacebookIcon';

type ClassNames = 'root' | 'button' | 'actionsContainer' | 'facebookButton';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  facebookButton: {
    color: '#FFFFFF',
    backgroundColor: '#3B5998',
    '&:hover': {
      backgroundColor: '#0e1f56',
    },
  },
});

interface Props extends Omit<StepProps, 'classes'>, WithStyles<ClassNames> {
  onLogin: () => void;
}

class LoginStep extends React.PureComponent<Props> {
  render() {
    const { classes, onLogin, ...stepProps } = this.props;
    return (
      <Step {...stepProps}>
        <StepLabel>Войдите</StepLabel>
        <StepContent>
          <Typography align="justify">
            Вход в приложение whitewater.guide осуществляется через Facebook. Войдите через тот же аккаунт Facebook,
            который вы собираетесь использовать в мобильном приложении.
          </Typography>
          <Button className={classNames(classes.button, classes.facebookButton)} variant="raised" color="primary">
            <FacebookIcon />
            Войти через Facebook
          </Button>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(LoginStep);
