import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {FlatLinkButton} from '../../core/components';
import {withAdmin} from '../users';

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

export default withAdmin()(ListSourcesLeft);