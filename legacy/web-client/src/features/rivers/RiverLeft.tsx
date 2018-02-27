import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {withAdmin} from '../users';
import {withFeatureIds} from '../../commons/core';
import {compose} from 'recompose';
import {FlatLinkButton} from '../../core/components';

class RiverLeft extends Component {

  static propTypes = {
    riverId: PropTypes.string,
    admin: PropTypes.bool,
  };

  render() {
    const {admin, riverId} = this.props;
    const toNewSection = {
      pathname: '/sections/new',
      search: `?riverId=${riverId}`,
    };
    return (
      <div style={styles.container}>
        <FlatLinkButton secondary={true} to={`/rivers/${riverId}`} label="Info"/>
        {admin && <FlatLinkButton secondary={true} to={`/rivers/${riverId}/settings`} label="Settings"/>}
        {admin && <FlatLinkButton secondary={true} to={toNewSection} label="New Section"/>}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
};

export default compose(
  withAdmin(),
  withFeatureIds('river')
)(RiverLeft);