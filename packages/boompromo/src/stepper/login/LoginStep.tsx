import CircularProgress from '@material-ui/core/CircularProgress';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import React from 'react';
import { Omit } from 'type-zoo';
import { FacebookConsumer } from '../../auth';
import AnonView from './AnonView';
import UserView from './UserView';

type ClassNames = 'button' | 'progress';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
          <FacebookConsumer>
            {({ me, loading, logout, login }) => {
              if (loading) {
                return (<CircularProgress className={classes.progress} />);
              }
              if (me) {
                return (<UserView user={me} logout={logout} />);
              }
              return (<AnonView login={login} />);
            }}
          </FacebookConsumer>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(LoginStep);
