import React, {Component, PropTypes} from 'react';
import {Roles} from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Page403Unauthorized from '../pages/Page403Unauthorized';

export default function adminOnly(Wrapped){
  class AdminWrapper extends Component {
    static propTypes = {
      admin: PropTypes.bool,
      ready: PropTypes.bool,
    };

    render() {
      const {admin, ready, ...props} = this.props;
      if (!ready){
        return null;
      }
      else if (admin){
        return (<Wrapped {...props}/>);
      }
      else {
        return (<Page403Unauthorized/>);
      }
    }
  }

  return createContainer(() => {
    return {
      admin: Roles.userIsInRole(Meteor.userId(), 'admin'),
      ready: Roles.subscription.ready(),
    };
  }, AdminWrapper);
}