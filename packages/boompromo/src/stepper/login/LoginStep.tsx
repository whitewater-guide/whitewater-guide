import { StyleRulesCallback } from '@material-ui/core';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Omit } from 'type-zoo';

type ClassNames = 'root' | 'button' | 'actionsContainer';

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
          <Typography>Превед медвед</Typography>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(LoginStep);
