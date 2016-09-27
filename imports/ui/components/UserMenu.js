import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Meteor } from 'meteor/meteor';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import { createContainer } from 'meteor/react-meteor-data';

class UserMenu extends Component {
  static propTypes = {
    user: PropTypes.object,
  };
  
  render() {
    return (
      <ToolbarGroup>
        <IconButton onTouchTap={this.onAvatarPress}>
          { this.getAvatar() }
        </IconButton>
      </ToolbarGroup>
    );
  }

  getAvatar = () => {
    const avatarProps = {};
    if (this.props.user){
      avatarProps.src = `//graph.facebook.com/${this.props.user.id}/picture`;
    }
    else {
      avatarProps.icon = (
        <FontIcon className="fa fa-sign-in"/>
      );
    }
    return (
      <Avatar {...avatarProps}/>
    );
  };

  onAvatarPress = () => {
    Meteor.loginWithFacebook(
      {requestPermissions: ['email']}, 
      (err) => {
        if (err)
          console.log('FB Error:', err);
      }
    );
  };

}

export default createContainer(() => {
  const subscription = Meteor.subscribe('userData');
  return {
    user: Meteor.user(),
  };
}, UserMenu);