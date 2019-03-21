import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { ToolbarGroup } from 'material-ui/Toolbar';
import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { API_HOST, FACEBOOK_APP_ID } from '../../../environment';
import { InnerProps } from './container';

const styles = {
  avatar: {
    padding: 0,
  },
};

interface State {
  loggingIn: boolean;
  menuOpen: boolean;
  anchorEl?: IconButton;
}

export default class UserMenu extends React.PureComponent<InnerProps, State> {
  state: State = {
    menuOpen: false,
    loggingIn: false,
  };

  onAvatarPress = (event: React.SyntheticEvent<any>) => {
    event.preventDefault();
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  onPopoverClose = () => {
    this.setState({
      menuOpen: false,
    });
  };

  onFacebookLogin = ({ accessToken }: ReactFacebookLoginInfo) => {
    this.setState({ loggingIn: true }, () => {
      fetch(
        `${API_HOST}/auth/facebook/signin?web=true&access_token=${accessToken}`,
        { credentials: 'include' },
      )
        .then(() => this.props.client.resetStore())
        .finally(() => this.setState({ loggingIn: false }));
    });
  };

  renderAvatar = () => {
    const { user } = this.props;
    const { loggingIn } = this.state;
    if (loggingIn) {
      return <CircularProgress color="white" size={24} />;
    }
    if (user) {
      return (
        <IconButton onClick={this.onAvatarPress} style={styles.avatar}>
          {user.avatar ? (
            <Avatar src={user.avatar} />
          ) : (
            <FontIcon className="material-icons">person</FontIcon>
          )}
        </IconButton>
      );
    }
    return (
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        fields="name,email,picture"
        callback={this.onFacebookLogin}
        render={({ onClick, isProcessing }) =>
          isProcessing ? (
            <CircularProgress color="white" size={24} />
          ) : (
            <IconButton style={styles.avatar} onClick={onClick}>
              <Avatar>
                <FontIcon className="fa fa-facebook" />
              </Avatar>
            </IconButton>
          )
        }
      />
    );
  };

  renderPopover = () => {
    return (
      <Popover
        open={this.state.menuOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={this.onPopoverClose}
      >
        <Menu>
          <MenuItem primaryText="Sign out" href={`${API_HOST}/auth/logout`} />
        </Menu>
      </Popover>
    );
  };

  render() {
    return (
      <ToolbarGroup>
        {this.renderAvatar()}
        {this.props.user && this.renderPopover()}
      </ToolbarGroup>
    );
  }
}
