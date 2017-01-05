import React, {Component, PropTypes} from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';
import {createContainer} from 'meteor/react-meteor-data';
import {Gauges} from '../../../api/gauges';

class ViewGaugeLeft extends Component {

  static propTypes = {
    params: PropTypes.shape({
      gaugeId: PropTypes.string,
    }),
    gauge: PropTypes.object,
    admin: PropTypes.bool,
  };

  render() {
    const sourceId = this.props.gauge ? this.props.gauge.source()._id : null;
    return (
      <div style={styles.container}>
        {this.props.admin && <FlatLinkButton secondary={true} to={`/gauges/${this.props.params.gaugeId}/settings`} label="Settings" />}
        <FlatLinkButton secondary={true} to={`/gauges/${this.props.params.gaugeId}`} label="Measurements" />
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

const ViewGaugeLeftContainer = createContainer(
  (props) => {
    const gauge = Gauges.findOne(props.params.gaugeId);
    return {
      gauge,
    };
  },
  ViewGaugeLeft
);

export default withAdmin(ViewGaugeLeftContainer);