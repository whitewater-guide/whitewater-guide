import React, {Component, PropTypes} from "react";
import GaugeForm from "./GaugeForm";
import {createGauge} from "../../../api/gauges";
import adminOnly from "../../hoc/adminOnly";
import {withRouter} from "react-router";

class NewGauge extends Component {
  static propTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    return (
      <GaugeForm
        sourceId={this.props.location.query.sourceId}
        method={createGauge}
        title="New Gauge"
        submitLabel="Create"
        multilang={false}
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
      />
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