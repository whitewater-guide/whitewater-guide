import React, {Component, PropTypes} from 'react';
import GaugeForm from './GaugeForm';
import { Meteor } from 'meteor/meteor';
import { Gauges, editGauge } from '../../../api/gauges';
import { createContainer } from 'meteor/react-meteor-data';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';

class EditGauge extends Component {
  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      sourceId: PropTypes.string,
      gaugeId: PropTypes.string,
    }),
    ready: PropTypes.bool,
    gauge: PropTypes.object,
  };

  constructor(props) {
    super(props);
    if (props.gauge)
      this.state = {...this.state, initialData: { ...props.gauge } };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gauge) {
      this.setState({ initialData: { ...nextProps.gauge } });
    }
  }

  render() {
    if (!this.props.ready)
      return null;
    return (
      <GaugeForm method={editGauge} title="Gauge Settings" submitLabel="Update"
        onSubmit={this.onSubmit} onCancel={this.onCancel}
        initialData={this.state.initialData}/>
    );
  }

  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };
}

const EditGaugeContainer = createContainer(
  (props) => {
    const subscription = Meteor.subscribe('gauges.details', props.params.gaugeId);
    const gauge = Gauges.findOne(props.params.gaugeId);
    return {
      gauge,
      ready: subscription.ready(),
    };
  },
  EditGauge
);

export default adminOnly(withRouter(EditGaugeContainer));