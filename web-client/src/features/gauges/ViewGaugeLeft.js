import React, {PureComponent, PropTypes} from 'react';
import {FlatLinkButton} from '../../core/components';
import container from './ViewGaugeLeftContainer';

class ViewGaugeLeft extends PureComponent {

  static propTypes = {
    gaugeId: PropTypes.string,
    sourceId: PropTypes.string,
    admin: PropTypes.bool,
  };

  render() {
    const {gaugeId, sourceId, admin} = this.props;
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton secondary={true} to={`/gauges/${gaugeId}/settings`} label="Settings" />}
        <FlatLinkButton secondary={true} to={`/gauges/${gaugeId}`} label="Measurements" />
        <FlatLinkButton secondary={true} to={`/sources/${sourceId}/terms_of_use`} label="Terms of use" />
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

export default container(ViewGaugeLeft);