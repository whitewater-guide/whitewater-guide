import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import {ToolbarGroup} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import container from './UserMenuContainer';
import {loginWithFacebook, logout as apolloLogout} from 'meteor-apollo-accounts';

class UserMenu extends Component {
  static propTypes = {
    user: PropTypes.shape({
      _id: PropTypes.string,
      email: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.string),
      profile: PropTypes.shape({
        name: PropTypes.string,
        link: PropTypes.string,
      }),
    }),
    loading: PropTypes.bool,
    client: PropTypes.any,//Apollo client
  };

  static contextTypes = {
    FB: PropTypes.any,
  };

  state = {
    menuOpen: false,
  };

  render() {
    return (
      <ToolbarGroup>
        {this.renderAvatar()}
        {this.props.user && this.renderPopover()}
      </ToolbarGroup>
    );
  }

  onPopoverClose = () => {
    this.setState({
      menuOpen: false,
    });
  };

  renderAvatar = () => {
    if (this.props.loading)
      return null;
    if (this.props.user) {
      return (
        <IconButton onTouchTap={this.onAvatarPress} style={styles.avatar}>
          <Avatar src={`//graph.facebook.com/${_.get(this.props, 'user.profile.id')}/picture`}/>
        </IconButton>
      );
    }
    return (
      <IconButton style={styles.avatar} onTouchTap={this.login} >
        <Avatar>
          <FontIcon className="material-icons">account_circle</FontIcon>
        </Avatar>
      </IconButton>
    );
  };

  onAvatarPress = (event) => {
    event.preventDefault();
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  renderPopover = () => {
    return (
      <Popover
        open={this.state.menuOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        onRequestClose={this.onPopoverClose}>
        <Menu>
          <MenuItem primaryText="Sign out" onTouchTap={this.logout}/>
        </Menu>
      </Popover>
    );
  };

  login = (event) => {
    event.preventDefault();
    this.context.FB.login(response => {
      console.log('On menu login', response);
      if (response.authResponse) {
        loginWithFacebook(response.authResponse, this.props.client)
          .then(() => this.props.client.resetStore());
      }
    });
  };

  logout = () => {
    apolloLogout(this.props.client)
      .then(() => {
        this.props.client.resetStore();
        this.context.FB.logout(response => {
          // user is now logged out
          console.log('On menu logout', response);
        });
      });
  };

}

const styles = {
  avatar: {
    padding: 0,
  },
};

export default container(UserMenu);