import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/es/Divider';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import React from 'react';
import { Omit } from 'type-zoo';
import { FacebookConsumer, FacebookContext } from '../../auth/fb';
import AnonView from './AnonView';
import UserView from './UserView';

type ClassNames = 'button' | 'progress' | 'buttonProgress' | 'wrapper' | 'divider';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
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
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
});

type Props = Omit<StepProps, 'classes'> & WithStyles<ClassNames> & {
  onNext: () => void;
};

interface State {
  loading: boolean;
}

class LoginStep extends React.PureComponent<Props, State> {
  state: State = { loading: false };

  renderUserView = ({ me, loading, logout, login }: FacebookContext) => {
    const { classes } = this.props;
    if (loading) {
      return (<CircularProgress className={classes.progress} />);
    }
    if (me) {
      return (<UserView user={me} logout={logout} />);
    }
    return (<AnonView login={login} />);
  };

  login = () => {
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 1000);
  };

  render() {
    const { classes, ...stepProps } = this.props;
    return (
      <Step {...stepProps}>
        <StepLabel>Войдите</StepLabel>
        <StepContent>
          <FacebookConsumer>
            {(fbContext) => (
              <React.Fragment>
                {this.renderUserView(fbContext)}
                <Divider className={classes.divider} />
                <div className={classes.wrapper}>
                  <Button
                    variant="raised"
                    color="primary"
                    disabled={!fbContext.me || !fbContext.accessToken || this.state.loading}
                    onClick={this.login}
                  >
                    Продолжить
                  </Button>
                  {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </React.Fragment>
            )}
          </FacebookConsumer>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(LoginStep);
