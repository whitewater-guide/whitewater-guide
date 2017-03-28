import React, { Component, PropTypes } from 'react';
import {FlatLinkButton} from '../../core/components';
import {withFeatureIds} from '../../commons/core';
import {withAdmin} from '../users';
import {compose} from 'recompose';


class SectionsLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
    regionId: PropTypes.string,
  };

  render() {
    const {admin, regionId} = this.props;
    const toNewSection = {
      pathname: '/sections/new',
    };
    if (regionId)
      toNewSection.search = `?regionId=${regionId}`;
    return (
      <div style={styles.container}>
        {admin && regionId && <FlatLinkButton secondary={true} to={toNewSection} label="New Section" />}
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
  withFeatureIds(),
)(SectionsLeft);