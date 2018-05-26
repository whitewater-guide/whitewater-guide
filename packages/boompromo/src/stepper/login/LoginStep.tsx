import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/es/Divider';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import red from '@material-ui/core/colors/red';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Omit } from 'type-zoo';
import { FacebookConsumer, FacebookContext } from '../../auth/fb';
import { wwLogin } from '../../auth/ww';
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
  error: Error | null;
}

class LoginStep extends React.PureComponent<Props, State> {
  state: State = { loading: false, error: null };

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

  login = async (accessToken: string) => {
    this.setState({ loading: true });
    const error = await wwLogin(accessToken);
    if (error) {
      this.setState({ loading: false, error });
    } else {
      this.setState({ loading: false, error: null });
      this.props.onNext();
    }
  };

  render() {
    const { classes, ...stepProps } = this.props;
    const { loading, error } = this.state;
    return (
      <Step {...stepProps}>
        <StepLabel>Войдите</StepLabel>
        <StepContent>
          <FacebookConsumer>
            {(fbContext) => (
              <React.Fragment>
                {this.renderUserView(fbContext)}
                <Divider className={classes.divider} />
                {
                  error &&
                  (
                    <Typography gutterBottom noWrap style={{ color: red[500] }}>
                      {error.message}
                    </Typography>
                  )
                }
                <div className={classes.wrapper}>
                  <Button
                    variant="raised"
                    color="primary"
                    disabled={!fbContext.me || !fbContext.accessToken || loading}
                    onClick={() => this.login(fbContext.accessToken!)}
                  >
                    Продолжить
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
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
