import React, {Component, PropTypes} from 'react';
import {Roles} from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export default function adminOnly(Wrapped){
  class AdminWrapper extends Component {
    static propTypes = {
      admin: PropTypes.bool,
    };

    render() {
      const {admin, ...props} = this.props;
      return (<Wrapped admin={admin} {...props}/>);
    }
  }

  return createContainer(() => {
    return {
      admin: Roles.userIsInRole(Meteor.userId(), 'admin'),
    };
  }, AdminWrapper);
}