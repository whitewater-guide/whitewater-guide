import React, {Component, PropTypes} from 'react';
import {withAdmin} from '../users';
import {withFeatureIds} from '../../core/hoc';
import {compose} from 'recompose';
import {FlatLinkButton, LeftMenuSeparator} from '../../core/components';

class ViewRegionLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
    regionId: PropTypes.string,
  };

  render() {
    const {regionId, admin} = this.props;
    const toSections = {pathname: '/sections', search: `?regionId=${regionId}`};
    const toRivers = {pathname: '/rivers', search: `?regionId=${regionId}`};
    const toNewRiver = {pathname: '/rivers/new', search: `?regionId=${regionId}`};
    const toNewSection = {pathname: '/sections/new', search: `?regionId=${regionId}`};
    return (
      <div style={styles.container}>
        <FlatLinkButton secondary={true} to={`/regions/${regionId}/map`} label="Region map"/>
        <FlatLinkButton secondary={true} to={`/regions/${regionId}/settings`} label="Region settings"/>
        <FlatLinkButton secondary={true} to={toRivers} label="Region rivers"/>
        <FlatLinkButton secondary={true} to={toSections} label="Region sections"/>
        {admin && <LeftMenuSeparator/> }
        {admin && <FlatLinkButton secondary={true} to={toNewRiver} label="New river"/>}
        {admin && <FlatLinkButton secondary={true} to={toNewSection} label="New section"/>}
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
)(ViewRegionLeft);