import React, {Component, PropTypes} from 'react';
import {withAdmin} from '../users';
import {FlatLinkButton, LeftMenuSeparator} from '../../core/components';

class ViewRegionLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
    match: PropTypes.object,
  };

  render() {
    const {match: {params: {regionId}}} = this.props;
    const toSections = {
      pathname: '/sections',
      query: {
        regionId,
      },
    };
    const toRivers = {
      pathname: '/rivers',
      query: {
        regionId,
      },
    };
    const toNewRiver = {
      pathname: '/rivers/new',
      query: {
        regionId,
      },
    };
    const toNewSection = {
      pathname: '/sections/new',
      query: {
        regionId,
      },
    };
    return (
      <div style={styles.container}>
        <FlatLinkButton secondary={true} to={`/regions/${regionId}/map`} label="Region map"/>
        <FlatLinkButton secondary={true} to={`/regions/${regionId}/settings`} label="Region settings"/>
        <FlatLinkButton secondary={true} to={toRivers} label="Region rivers"/>
        <FlatLinkButton secondary={true} to={toSections} label="Region sections"/>
        <LeftMenuSeparator/>
        <FlatLinkButton secondary={true} to={toNewRiver} label="New river"/>
        <FlatLinkButton secondary={true} to={toNewSection} label="New section"/>
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

export default withAdmin()(ViewRegionLeft);