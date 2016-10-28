import React, {Component, PropTypes} from 'react';
import GaugeForm from './GaugeForm';
import { createGauge } from '../../../api/gauges';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';

class NewGauge extends Component {
  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
  };

  render() {
    const initialData = { sourceId: this.props.params.sourceId };
    return (
      <GaugeForm method={createGauge} title="New Gauge" submitLabel="Create"
        onSubmit={this.onSubmit} onCancel={this.onCancel}
        initialData={initialData}/>
    );
  }

  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };
}

export default adminOnly(withRouter(NewGauge));