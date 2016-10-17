import React, { Component, PropTypes } from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';

class ViewGaugeLeft extends Component {

  static propTypes = {
    params: PropTypes.shape({
      gaugeId: PropTypes.string,
    }),
    admin: PropTypes.bool,
  };

  render() {
    return (
      <div style={styles.container}>
        {this.props.admin && <FlatLinkButton secondary={true} to={`/gauges/${this.props.params.gaugeId}/settings`} label="Settings" />}
        <FlatLinkButton secondary={true} to={`/gauges/${this.props.params.gaugeId}`} label="Measurements" />
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

export default withAdmin(ViewGaugeLeft);