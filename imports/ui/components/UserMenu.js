import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Meteor } from 'meteor/meteor';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { createContainer } from 'meteor/react-meteor-data';

class UserMenu extends Component {
  static propTypes = {
    user: PropTypes.object,
    loggingIn: PropTypes.bool,
  };

  state = {
    menuOpen: false,
  };

  render() {
    return (
      <ToolbarGroup>
        <IconButton onTouchTap={this.onAvatarPress}>
          {this.getAvatar()}
        </IconButton>
        {this.props.user && this.renderPopover()}
      </ToolbarGroup>
    );
  }

  renderPopover = () => {
    return (
      <Popover
        open={this.state.menuOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={this.onPopoverClose} >
        <Menu>
          <MenuItem primaryText="Sign out" onTouchTap={this.signOut}/>
        </Menu>
      </Popover>
    );
  };

  onPopoverClose = () => {
    this.setState({
      menuOpen: false,
    });
  };

  getAvatar = () => {
    const avatarProps = {};
    if (this.props.loggingIn){
      return null;
    }
    else if (this.props.user) {
      avatarProps.src = `//graph.facebook.com/${this.props.user.services.facebook.id}/picture`;
    }
    else {
      avatarProps.icon = (
        <FontIcon className="fa fa-sign-in" />
      );
    }
    return (
      <Avatar {...avatarProps} />
    );
  };

  onAvatarPress = (event) => {
    event.preventDefault();
    if (this.props.user){
      this.setState({
        menuOpen: true,
        anchorEl: event.currentTarget,
      });
    }
    else {
      Meteor.loginWithFacebook(
        { requestPermissions: ['email'] },
        (err) => {
          if (err)
            console.log('FB Error:', err);
        }
      );
    }
  };

  signOut = () => {
    Meteor.logout((err) => err && console.log('Logout error:', err));
  };

}

export default createContainer(() => {
  const subscription = Meteor.subscribe('userData');
  return {
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  };
}, UserMenu);