import React, {Component, PropTypes} from 'react';
import FlatLinkButton from '../../components/FlatLinkButton';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Roles} from 'meteor/alanning:roles';

class ListSourcesLeft extends Component {
  static propTypes = {
    admin: PropTypes.bool,
  };

  render() {
    const {admin} = this.props;
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton to="/sources/new" label="New Source" secondary={true}/>}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  }
};

export default createContainer(() => {
  return {
    admin: Roles.userIsInRole(Meteor.userId(), 'admin'),
  };
}, ListSourcesLeft);