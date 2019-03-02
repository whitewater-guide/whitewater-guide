import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { ToolbarGroup } from 'material-ui/Toolbar';
import React from 'react';
import { API_HOST } from '../../../environment';
import { InnerProps } from './container';

const styles = {
  avatar: {
    padding: 0,
  },
};

interface State {
  menuOpen: boolean;
  anchorEl?: IconButton;
}

export default class UserMenu extends React.PureComponent<InnerProps, State> {
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

  renderAvatar = () => {
    const { user } = this.props;
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
    const href = `${API_HOST}/auth/facebook?returnTo=${window.location.href}`;
    return (
      <IconButton style={styles.avatar} href={href}>
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
