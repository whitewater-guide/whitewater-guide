import CircularProgress from '@material-ui/core/CircularProgress';
import red from '@material-ui/core/colors/red';
import Divider from '@material-ui/core/es/Divider';
import { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Omit } from 'type-zoo';
import { NextButton } from '../../components';
import AnonView from './AnonView';
import { LoginStepStore } from './store';
import { ILoginStepStore } from './types';
import UserView from './UserView';

type ClassNames = 'button' | 'progress' | 'divider';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
});

type Props = Omit<StepProps, 'classes'> &
  WithStyles<ClassNames> & {
    next: (username: string) => void;
    store?: ILoginStepStore;
  };

@observer
class LoginStepView extends React.Component<Props> {
  @observable store: ILoginStepStore = new LoginStepStore();

  constructor(props: Props) {
    super(props);
    if (props.store) {
      this.store = props.store;
    }
  }

  componentDidMount() {
    this.store.init();
  }

  renderUserView = () => {
    const { classes } = this.props;
    if (this.store.facebookLoading) {
      return <CircularProgress className={classes.progress} />;
    }
    if (this.store.me) {
      return <UserView user={this.store.me} logout={this.store.fbLogout} />;
    }
    return <AnonView login={this.store.fbLogin} />;
  };

  next = async () => {
    const success = await this.store.login();
    if (success) {
      this.props.next(this.store.me!.name);
    }
  };

  render() {
    const { classes, store, next, ...stepProps } = this.props;
    const { loading, error, ready } = this.store;
    return (
      <StepContent {...stepProps}>
        {this.renderUserView()}
        <Divider className={classes.divider} />
        {!!error && (
          <Typography
            gutterBottom={true}
            noWrap={true}
            style={{ color: red[500] }}
          >
            {error}
          </Typography>
        )}
        <NextButton disabled={!ready} onClick={this.next} loading={loading} />
      </StepContent>
    );
  }
}

export default withStyles(styles)(LoginStepView);
