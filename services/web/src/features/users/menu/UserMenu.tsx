import { AuthContext, AuthState } from '@whitewater-guide/clients';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { ToolbarGroup } from 'material-ui/Toolbar';
import React from 'react';

const styles = {
  avatar: {
    padding: 0,
  },
};

interface State {
  menuOpen: boolean;
  anchorEl?: IconButton;
}

export class UserMenu extends React.PureComponent<{}, State> {
  static contextType = AuthContext;

  state: State = {
    menuOpen: false,
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

  signIn = () => {
    const { service }: AuthState = this.context;
    service.signIn('facebook');
  };

  signOut = () => {
    this.setState({ menuOpen: false });
    const { service }: AuthState = this.context;
    service.signOut();
  };

  renderAvatar = () => {
    const { me }: AuthState = this.context;
    if (me) {
      return (
        <IconButton onClick={this.onAvatarPress} style={styles.avatar}>
          {me.avatar ? (
            <Avatar src={me.avatar} />
          ) : (
            <FontIcon className="material-icons">person</FontIcon>
          )}
        </IconButton>
      );
    }
    return (
      <IconButton style={styles.avatar} onClick={this.signIn}>
        <Avatar>
          <FontIcon className="fa fa-facebook" />
        </Avatar>
      </IconButton>
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
          <MenuItem primaryText="Sign out" onClick={this.signOut} />
        </Menu>
      </Popover>
    );
  };

  render() {
    const { me }: AuthState = this.context;
    return (
      <ToolbarGroup>
        {this.renderAvatar()}
        {!!me && this.renderPopover()}
      </ToolbarGroup>
    );
  }
}
